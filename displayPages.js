let pageName = document.documentElement.getAttribute("pageName")

let filters = [];
let displayedItems = [];
let information;

let sortingPriority;

document.getElementById("sort-select-values").addEventListener("change", function() {
    changeSort(this.value);
});

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
            console.log(prop);
            let first;
            let second;
            if (sortPriority[i]["direction"] === "ascending"){
                first = a;
                second = b;
            } else {
                console.log("test")
                first = b;
                second = a;
            }
            console.log(first[prop] + " " + second[prop]);
            if (first[prop] !== second[prop]) {
                if(prop === "price" || prop === "inventory") {
                    console.log(first[prop] - second[prop])
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
        filterButton = document.getElementById(filter);
        filterButton.classList.remove("pressed");

        filters.splice(filters.indexOf(filter), 1)

        if(filters.length == 0){

            itemInfo = information["pages"][pageName]["items"]

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
        filterButton = document.getElementById(filter);
        filterButton.classList.add("pressed");
        if (filters.length == 0){
            let iterableDisplayedItems = displayedItems.slice();
            for (item of iterableDisplayedItems){
                if (!information["pages"][pageName]["filters"][filter].includes(item)){
                    removeItem(item, page);
                }
            }
        } else {

            itemInfo = information["pages"][pageName]["items"]

            for (item of information["pages"][pageName]["filters"][filter]){
                if (!displayedItems.includes(item)){
                    displayItem(item, itemInfo, page);
                }
            }
        }
        filters.push(filter)
    }
 
    sortElements(sortingPriority)
}

function renderPage(pages){
    information = pages;

    sortSelect = document.getElementById("sort-select-values");

    for (let sortOption in pages["pages"][pageName]["sortOptions"]){
        if(sortingPriority == null){
            sortingPriority = pages["pages"][pageName]["sortOptions"][sortOption];
        }
        sortElement = document.createElement("option");
        sortElement.value = sortOption;
        sortElement.textContent = sortOption;
        sortSelect.appendChild(sortElement);
    }

    navbar = document.getElementById("navbar");
    for (let pageName in pages["pages"]){
        listElement = document.createElement("li")
        listElement.className = "navbar"
        listElement.innerHTML = `<a href="${pages["pages"][pageName]["fileName"]}">${pageName}</a>`
        navbar.appendChild(listElement)
    }
    sidebar = document.getElementById("filters");
    for(let filter in pages["pages"][pageName]["filters"]){
        filterDiv = document.createElement("div");
        filterDiv.innerHTML = `<button id="${filter}", type="button", onclick="changeFilters('${filter}')">${filter}</button>`
        sidebar.appendChild(filterDiv);
    }

    page = document.getElementById("page")
    itemInfo = pages["pages"][pageName]["items"]
    for(let item in itemInfo){
        displayItem(item, itemInfo, page);
    }

    sortElements(sortingPriority);
}

function displayItem(item, itemInfo, page) {
    li = document.createElement("li");
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
    child = document.getElementById(item.split(" ").join("_"))
    page.removeChild(child);
    displayedItems.splice(displayedItems.indexOf(item), 1);
}

function inFilters(item, pages){
    if (filters.length == 0){
        return true;
    }
    for (filter of filters){
        for (filteredItem of pages["pages"][pageName]["filters"][filter]){
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