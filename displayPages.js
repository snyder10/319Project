let pageName = document.documentElement.getAttribute("pageName")

let filters = [];
let displayedItems = [];
let information;

function changeFilters(filter){
    console.log(displayedItems)
    itemInfo = information["pages"][pageName]["items"]
    if (filters.includes(filter)){
        filterButton = document.getElementById(filter);
        filterButton.classList.remove("pressed");
        filters.splice(filters.indexOf(filter), 1)
        if(filters.length == 0){
            for (item in itemInfo){
                page = document.getElementById("page");
                displayItem(item, itemInfo, page)
            }
        }
        else {
            console.log(information["pages"][pageName]["filters"][filter])
            for (item of information["pages"][pageName]["filters"][filter]){
                console.log("testing: " + item)
                if (displayedItems.includes(item)){
                    page = document.getElementById("page");
                    removeItem(item, page);
                }
            }
        }
    } else {
        filterButton = document.getElementById(filter);
        filterButton.classList.add("pressed");
        if (filters.length == 0){
            for (item of displayedItems){
                console.log("testing: " + item)
                if (!information["pages"][pageName]["filters"][filter].includes(item)){
                    console.log(information["pages"][pageName]["filters"][filter] + ": " + item)
                    page = document.getElementById("page");
                    removeItem(item, page);
                } else {
                    console.log(item);
                }
            }
        } else {
            for (item of information["pages"][pageName]["filters"][filter]){
                if (!displayedItems.includes(item)){
                    page = document.getElementById("page");
                    displayItem(item, itemInfo, page);
                }
            }
        }
        filters.push(filter)
    }

    // fetch("./data.json")
    // .then(response => response.json())
    // .then(pages => resetPage(pages));
}

function renderPage(pages){
    information = pages;
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
        console.log(filterDiv)
        sidebar.appendChild(filterDiv);
    }

    page = document.getElementById("page")
    itemInfo = pages["pages"][pageName]["items"]
    for(let item in itemInfo){
        displayItem(item, itemInfo, page);
    }
}

function displayItem(item, itemInfo, page) {
    div = document.createElement("div");
    div.id = item.split(" ").join("_");
    div.innerHTML = `<p>${item}: $${itemInfo[item]["price"]}</p>`;
    page.appendChild(div);
    displayedItems.push(item);
}

function removeItem(item, page) {
    console.log(item.split(" ").join("_"))
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
            console.log(filteredItem)
            if (filteredItem === item){
                return true;
            }
        }
    }
    return false;
}

// function resetPage(pages){
//     sidebar = document.getElementById("filters");
//     sidebar.innerHTML = "";
//     for(let filter in pages["pages"][pageName]["filters"]){
//         filterDiv = document.createElement("div");
//         if (filters.includes(filter)){
//             filterDiv.innerHTML = `<button type="button", onclick="changeFilters('${filter}')" class=pressed>${filter}</button>`
//         } else {
//             filterDiv.innerHTML = `<button type="button", onclick="changeFilters('${filter}')">${filter}</button>`
//         }
//         sidebar.appendChild(filterDiv);
//     }

//     page = document.getElementById("page")
//     itemInfo = pages["pages"][pageName]["items"]
//     page.innerHTML = "";
//     for(let item in itemInfo){
//         if(inFilters(item, pages)){
//             div = document.createElement("div");
//             div.innerHTML = `<p>${item}: $${itemInfo[item]["price"]}</p>`;
//             page.appendChild(div);
//         }
//     }
// }

fetch("./data.json")
    .then(response => response.json())
    .then(pages => renderPage(pages));