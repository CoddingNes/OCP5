//Appel de l'API
fetch(`http://localhost:3000/api/products/`)
  .then((response) => response.json())
  .then((data) => {
    
    console.table(data)

//Création des articles de chaque item    
    for (let i = 0; i < data.length; i++) {
        //Création des éléments      
        const sectionItemElement = document.querySelector("#items");
        const lienItemElement = document.createElement("a");
        lienItemElement.setAttribute("href", `./product.html?id=${data[i]._id}`);
        const articleItemElement = document.createElement("article");
        const imgItemElement = document.createElement("img");
        imgItemElement.setAttribute("src", data[i].imageUrl);
        imgItemElement.setAttribute("alt", data[i].altTxt);
        const h3ItemElement = document.createElement("h3");
        h3ItemElement.setAttribute("className", "productName");
        h3ItemElement.innerText = data[i].name;
        const pItemElement = document.createElement("p");
        pItemElement.setAttribute("className", "productDescription");
        pItemElement.innerText = data[i].description;

        //Agencement des éléments
        sectionItemElement.appendChild(lienItemElement);
        lienItemElement.appendChild(articleItemElement);
        articleItemElement.append(imgItemElement, h3ItemElement, pItemElement);

    }
});