const searchParams = new URLSearchParams(window.location.search);

pageName = searchParams.get("page")
item = searchParams.get("product")

console.log(pageName)
console.log(item)


function displayItem(pages) {
    let title = document.querySelector("title")

    title.innerHTML = item

    page = document.getElementById("page")

    itemInfo = pages["pages"][pageName]["items"]

    navbar = document.getElementById("navbar-product");
    for (let pageName in pages["pages"]){
        listElement = document.createElement("li")
        listElement.className = "navbar"
        listElement.innerHTML = `<a href="${pages["pages"][pageName]["fileName"]}">${pageName}</a>`
        navbar.appendChild(listElement)
    }

    div = document.createElement("div");
    div.classList.add("item-page")

    let saleChange = (parseInt(itemInfo[item]["sold this week"]) - parseInt(itemInfo[item]["sold last week"])) / parseInt(itemInfo[item]["sold last week"]) * 100

    let score = parseInt(itemInfo[item]["rating"]);
    console.log(score);

    let rating = "";
    for (let i = 0; i < score; i++){
        rating += "★";
    }

    for (let i = 0; i < 5 - score; i++){
        rating += "☆";
    }

    if(itemInfo[item]["price"] != itemInfo[item]["original price"]){
        div.innerHTML = `<img src="${itemInfo[item]["image"]}" width=500 height=500><div class="product-view"><h1>${item}</h1><hr><div class="price"><s> $${itemInfo[item]["original price"]}</s> $${itemInfo[item]["price"]}</div><div class="inventory">In Stock: ${itemInfo[item]["inventory"]}</div><hr><div class="popularity">Popularity Increase over the Past Week: ${saleChange}%</div><div class="rating">User Rating: ${rating}</div></div>`;
    } else {
        div.innerHTML = `<img src="${itemInfo[item]["image"]}" width=500 height=500><div class="product-view"><h1>${item}</h1><hr><div class="price">$${itemInfo[item]["price"]}</div><div class="inventory">In Stock: ${itemInfo[item]["inventory"]}</div><hr><div class="popularity">Popularity Increase over the Past Week: ${saleChange}%</div><div class="rating">User Rating: ${rating}</div></div>`;
    }
    page.appendChild(div);
}



fetch("./data.json")
    .then(response => response.json())
    .then(pages => displayItem(pages));