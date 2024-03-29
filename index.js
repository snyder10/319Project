let pageName = document.documentElement.getAttribute("pageName")

if(pageName === "Product Page") {
    const searchParams = new URLSearchParams(window.location.search);

    let page_name = searchParams.get("page")
    let item = searchParams.get("product")

    function renderPage(pages) {
        let title = document.querySelector("title")
    
        title.innerHTML = item
    
        let page = document.getElementById("page")
    
        let itemInfo = pages["pages"][page_name]["items"]
    
        let navbar = document.getElementById("navbar");
        renderNavbar(pages, navbar);
    
        renderItem(itemInfo, page);
    }

    function renderItem(itemInfo, page) {
        div = document.createElement("div");
        div.classList.add("item-page");

        let saleChange = parseFloat((parseInt(itemInfo[item]["sold this week"]) - parseInt(itemInfo[item]["sold last week"])) / parseInt(itemInfo[item]["sold last week"]) * 100).toFixed(2);

        let score = parseInt(itemInfo[item]["rating"]);

        let rating = "";
        for (let i = 0; i < score; i++) {
            rating += "★";
        }

        for (let i = 0; i < 5 - score; i++) {
            rating += "☆";
        }

        if (itemInfo[item]["price"] != itemInfo[item]["original price"]) {
            div.innerHTML = `<img src="${itemInfo[item]["image"]}" width=500 height=500><div class="product-view"><h1>${item}</h1><hr><div class="price"><s> $${itemInfo[item]["original price"]}</s> $${itemInfo[item]["price"]}</div><div class="inventory">In Stock: ${itemInfo[item]["inventory"]}</div><hr><div class="popularity">Popularity Change Over the Past Week: ${saleChange}%</div><div class="rating">${rating}</div></div>`;
        } else {
            div.innerHTML = `<img src="${itemInfo[item]["image"]}" width=500 height=500><div class="product-view"><h1>${item}</h1><hr><div class="price">$${itemInfo[item]["price"]}</div><div class="inventory">In Stock: ${itemInfo[item]["inventory"]}</div><hr><div class="popularity">Popularity Change Over the Past Week: ${saleChange}%</div><div class="rating">${rating}</div></div>`;
        }
        page.appendChild(div);
    }
} else if (pageName === "Home") {
    function renderPage(pages) {
        let navbar = document.getElementById("navbar");
        renderNavbar(pages, navbar); 

        let trendingItems = document.getElementById("trending-items");
        let trendData = pages["home"]["trending-items"];

        let pageInfo = pages["pages"];

        for(let item in trendData){
            let li = document.createElement("li");
            li.classList.add("items-container")
            let page = trendData[item];
            let itemInfo = pageInfo[page]["items"]
            let saleChange = parseFloat((parseInt(pageInfo[page]["items"][item]["sold this week"]) - parseInt(pageInfo[page]["items"][item]["sold last week"])) / parseInt(pageInfo[page]["items"][item]["sold last week"]) * 100).toFixed(2);            
            li.innerHTML = `<a href="./productPage.html?page=${page}&product=${item}"><div class="item-image"><img src="${itemInfo[item]["image"]}" width=350 height=350 class="item-image"></div><hr><div class="item"><p>${item}</p><p><span style="color:green;">${saleChange}% Increase</span></p></div></a>`

            trendingItems.appendChild(li);
        }

        let sales = document.getElementById("sales")

        for(let page in pageInfo){
            for(let item of pageInfo[page]["filters"]["Sales"]){
                let li = document.createElement("li");
                li.classList.add("items-container")
                let itemInfo = pageInfo[page]["items"]
                li.innerHTML = `<a href="./productPage.html?page=${page}&product=${item}"><div class="item-image"><img src="${itemInfo[item]["image"]}" width=350 height=350 class="item-image"></div><hr><div class="item"><p>${item}</p><p><s>$${pageInfo[page]["items"][item]["original price"]}</s> → <span style="color:green;">$${pageInfo[page]["items"][item]["price"]}</span></p></div></a>`
                sales.appendChild(li);
            }
        }
    }
} else if (pageName === "About") {
    function renderPage(pages){
        let navbar = document.getElementById("navbar");
        renderNavbar(pages, navbar); 
    }
} else {
    function renderPage(pages){
        information = pages;
    
        sortSelect = document.getElementById("sort-select-values");
    
        renderSortOptions(pages);
    
        let navbar = document.getElementById("navbar");
        renderNavbar(pages, navbar);

        let sidebar = document.getElementById("filters");
        renderSidebar(sidebar, pages);
    
        let page = document.getElementById("page")
        let itemInfo = pages["pages"][pageName]["items"]
        for(let item in itemInfo){
            displayItem(item, itemInfo, page);
        }
    
        sortElements(sortingPriority);
    }

    document.getElementById("sort-select-values").addEventListener("change", function() {
        changeSort(this.value);
    });
}

let filters = [];
let displayedItems = [];
let information;

let sortingPriority;

function renderSortOptions(pages) {
    for (let sortOption in pages["pages"][pageName]["sortOptions"]) {
        if (sortingPriority == null) {
            sortingPriority = pages["pages"][pageName]["sortOptions"][sortOption];
        }
        sortElement = document.createElement("option");
        sortElement.value = sortOption;
        sortElement.textContent = sortOption;
        sortSelect.appendChild(sortElement);
    }
}

function renderSidebar(sidebar, pages) {
    for (let filter in pages["pages"][pageName]["filters"]) {
        let filterDiv = document.createElement("div");
        filterDiv.innerHTML = `<button id="${filter}", type="button", onclick="changeFilters('${filter}')">${filter}</button>`;
        sidebar.appendChild(filterDiv);
    }
}

function renderNavbar(pages, navbar) {
    for (let page_name in pages["pages"]) {
        let listElement = document.createElement("li");
        listElement.className = "navbar";
        listElement.innerHTML = `<a href="${pages["pages"][page_name]["fileName"]}">${page_name}</a>`;
        navbar.appendChild(listElement);
    }
}

function changeSort(sortSelect){
    sortingPriority = information["pages"][pageName]["sortOptions"][sortSelect];
    sortElements(sortingPriority);
}

function sortElements(sortPriority){

    const items = document.querySelectorAll(".items-container");


    const itemsArray = Array.from(items).map(item => {
        let split = item.textContent.split('$');
        const price = parseFloat(split[split.length - 1]);
        const name = item.textContent.split(':')[0];
        const inventory = parseInt(item.textContent.split(':')[2]);


        return { item, price, name, inventory};
    });


    itemsArray.sort((a, b) => {

        for (let i = 0; i < sortPriority.length; i++) {
            let prop = sortPriority[i]["priority"];
            let first;
            let second;
            if (sortPriority[i]["direction"] === "ascending"){
                first = a;
                second = b;
            } else {
                first = b;
                second = a;
            }
            if (first[prop] !== second[prop]) {
                if(prop === "price" || prop === "inventory") {
                    return first[prop] - second[prop];
                } else {
                    return first[prop].localeCompare(second[prop], undefined, { sensitivity: 'base' });
                }
            }
        }
        return 0;
    });

    const container = document.getElementById("page");
    itemsArray.forEach(({ item }) => {
        container.appendChild(item);
    });
}

function changeFilters(filter){
    let page = document.getElementById("page");

    if (filters.includes(filter)){
        let filterButton = document.getElementById(filter);
        filterButton.classList.remove("pressed");

        filters.splice(filters.indexOf(filter), 1)

        if(filters.length == 0){

            let itemInfo = information["pages"][pageName]["items"]

            for (item in itemInfo){
                if(!displayedItems.includes(item)){
                    displayItem(item, itemInfo, page)
                }
            }
        }
        else {
            for (item of information["pages"][pageName]["filters"][filter]){
                if (displayedItems.includes(item) && !inFilters(item, information)){
                    removeItem(item, page);
                }
            }
        }
    } else {
        let filterButton = document.getElementById(filter);
        filterButton.classList.add("pressed");
        if (filters.length == 0){
            let iterableDisplayedItems = displayedItems.slice();
            for (item of iterableDisplayedItems){
                if (!information["pages"][pageName]["filters"][filter].includes(item)){
                    removeItem(item, page);
                }
            }
        } else {

            let itemInfo = information["pages"][pageName]["items"]

            for (let item of information["pages"][pageName]["filters"][filter]){
                if (!displayedItems.includes(item)){
                    displayItem(item, itemInfo, page);
                }
            }
        }
        filters.push(filter)
    }
 
    sortElements(sortingPriority)
}
 
function displayItem(item, itemInfo, page) {
    let li = document.createElement("li");
    li.id = item.split(" ").join("_");
    li.classList.add("items-container")
    if(itemInfo[item]["price"] != itemInfo[item]["original price"]){
        li.innerHTML = `<a href="./productPage.html?page=${pageName}&product=${item}"><div class="item-image"><img src="${itemInfo[item]["image"]}" width=350 height=350 class="item-image"></div><hr><div class="item"><p>${item}: <s> $${itemInfo[item]["original price"]}</s> $${itemInfo[item]["price"]}</p><p>Inventory: ${itemInfo[item]["inventory"]}</p></div></a>`;
    } else {
        li.innerHTML = `<a href="./productPage.html?page=${pageName}&product=${item}"><div class="item-image"><img src="${itemInfo[item]["image"]}" width=350 height=350 class="item-image"></div><hr><div class="item"><p>${item}: $${itemInfo[item]["price"]}</p><p>Inventory: ${itemInfo[item]["inventory"]}</p></div></a>`;
    }
    page.appendChild(li);
    displayedItems.push(item);
}

function removeItem(item, page) {
    let child = document.getElementById(item.split(" ").join("_"))
    page.removeChild(child);
    displayedItems.splice(displayedItems.indexOf(item), 1);
}

function inFilters(item, pages){
    if (filters.length == 0){
        return true;
    }
    for (let filter of filters){
        for (let filteredItem of pages["pages"][pageName]["filters"][filter]){
            if (filteredItem === item){
                return true;
            }
        }
    }
    return false;
}

fetch("./data.json")
    .then(response => response.json())
    .then(pages => renderPage(pages));