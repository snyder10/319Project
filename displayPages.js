let pageName = document.documentElement.getAttribute("pageName")

let filters = [];

function changeFilters(filter){
    if (filters.includes(filter)){
        filters.splice(filters.indexOf(filter), 1)
    } else {
        filters.push(filter)
    }

    fetch("./data.json")
    .then(response => response.json())
    .then(pages => resetPage(pages));
}

function renderPage(pages){
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
        filterDiv.innerHTML = `<button type="button", onclick="changeFilters('${filter}')">${filter}</button>`
        sidebar.appendChild(filterDiv);
    }

    page = document.getElementById("page")
    itemInfo = pages["pages"][pageName]["items"]
    for(let item in itemInfo){
        div = document.createElement("div");
        div.innerHTML = `<p>${item}: $${itemInfo[item]["price"]}</p>`;
        page.appendChild(div);
    }
}

function inFilters(item, pages){
    if (filters.length == 0){
        return true;
    }
    for (filter of filters){
        for (filteredItem of pages["pages"][pageName]["filters"][filter]){
            console.log(filteredItem)
            if (filteredItem === item){
                return true;
            }
        }
    }
    return false;
}

function resetPage(pages){
    sidebar = document.getElementById("filters");
    sidebar.innerHTML = "";
    for(let filter in pages["pages"][pageName]["filters"]){
        filterDiv = document.createElement("div");
        if (filters.includes(filter)){
            filterDiv.innerHTML = `<button type="button", onclick="changeFilters('${filter}')" class=pressed>${filter}</button>`
        } else {
            filterDiv.innerHTML = `<button type="button", onclick="changeFilters('${filter}')">${filter}</button>`
        }
        sidebar.appendChild(filterDiv);
    }

    page = document.getElementById("page")
    itemInfo = pages["pages"][pageName]["items"]
    page.innerHTML = "";
    for(let item in itemInfo){
        if(inFilters(item, pages)){
            div = document.createElement("div");
            div.innerHTML = `<p>${item}: $${itemInfo[item]["price"]}</p>`;
            page.appendChild(div);
        }
    }
}

fetch("./data.json")
    .then(response => response.json())
    .then(pages => renderPage(pages));