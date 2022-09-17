//Lire le localStorage
let objLinea = localStorage.getItem("cart");
let cart = JSON.parse(objLinea);
console.log("Nous avons ajouté "+ cart.length +" items");

    let totalQuantity = 0;
    let totalPrice = 0;

//Appel de l'API
fetch(`http://localhost:3000/api/products/`)
  .then((response) => response.json())
  .then((data) => {

    const cartItems = document.querySelector('#cart__items');

//Parcourir le localStorage
    for (let i = 0; i < objJson.length; i++) {
        let item = objJson[i];
//Identifier les items du localStorage dans l'API grâce à l'ID        
        for (let i = 0; i < data.length; i++) {
            if (data[i]._id == item.id) {
                let itemDetails = data[i];
//Créer et configurer un nouvel article pour chaque item                
                let newArticle = document.createElement('article');
                newArticle.setAttribute('class', 'cart__item');
                newArticle.setAttribute('data-id', '${itemDetails.id}');
                newArticle.setAttribute('data-color', '${item.colors}');
                newArticle.innerHTML = `
                        <div class="cart__item__img">
                            <img src="${itemDetails.imageUrl}" alt="${itemDetails.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${itemDetails.name}</h2>
                                <p>${item.cartColors}</p>
                                <p>${itemDetails.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>`
                cartItems.appendChild(newArticle);

//Mettre à jour les totaux                
                totalQuantity += parseInt(item.quantity);
                totalPrice += (itemDetails.price * item.quantity);
                const totalQuantityElement = document.querySelector('#totalQuantity');
                totalQuantityElement.innerHTML = totalQuantity;
                const totalPriceElement = document.querySelector('#totalPrice');
                totalPriceElement.innerHTML = totalPrice;           
            }
        }
    }


    let qtt = document.querySelectorAll('.itemQuantity');
    console.log(qtt);
    console.log(values(qtt));


  });


//Erreurs
const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
const addressErrorMsg = document.querySelector('#addressErrorMsg');
const cityErrorMsg = document.querySelector('#cityErrorMsg');
const emailErrorMsg = document.querySelector('#emailErrorMsg');