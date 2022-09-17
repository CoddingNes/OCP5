fetch(`http://localhost:3000/api/products/`)
  .then((response) => response.json())
  .then((data) => {
    
    console.table(data)
    for (let i = 0; i < data.length; i++) {
        let items = document.querySelector("#items");
        let htmlCard = `
          <a href="./product.html?id=${data[i]._id}"> 
            <article> 
              <img src="${data[i].imageUrl}" alt="${data[i].altTxt}"> 
              <h3 class="productName">${data[i].name}</h3> 
              <p class="productDescription">${data[i].description}</p> 
            </article> 
          </a>`;
        items.innerHTML += htmlCard
    }
    });