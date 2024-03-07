const searchParams = new URLSearchParams(window.location.search);

pageName = searchParams.get("page")
item = searchParams.get("product")

console.log(pageName)
console.log(item)


function displayItem(pages) {

    page = document.getElementById("page")

    itemInfo = pages["pages"][pageName]["items"]

    li = document.createElement("li");
    li.id = item.split(" ").join("_");
    li.classList.add("items-container")
    if(itemInfo[item]["price"] != itemInfo[item]["original price"]){
        li.innerHTML = `<a href="./productPage.html?page=${pageName}&product=${item}"><div class="item-image"><img src="${itemInfo[item]["image"]}" width=350 height=350 class="item-image"></div><hr><div class="item"><p>${item}: <s> $${itemInfo[item]["original price"]}</s> $${itemInfo[item]["price"]}</p><p>Inventory: ${itemInfo[item]["inventory"]}</p></div></a>`;
    } else {
        li.innerHTML = `<a href="./productPage.html?page=${pageName}&product=${item}"><div class="item-image"><img src="${itemInfo[item]["image"]}" width=350 height=350 class="item-image"></div><hr><div class="item"><p>${item}: $${itemInfo[item]["price"]}</p><p>Inventory: ${itemInfo[item]["inventory"]}</p></div></a>`;
    }
    page.appendChild(li);
}



fetch("./data.json")
    .then(response => response.json())
    .then(pages => displayItem(pages));