//Lire le localStorage
let cart = JSON.parse(localStorage.getItem("cart"));
console.log("Il y a "+ cart.length +" items différents dans le panier");


//Appel de l'API
/*cart.forEach(item => {
fetch(`http://localhost:3000/api/products/${item.id}`)
*/
fetch(`http://localhost:3000/api/products/`)
  .then((response) => response.json())
  .then((data) => {

    const cartItems = document.querySelector('#cart__items');
    let totalQuantityIni = 0;
    let totalPrice = 0;

//Parcourir le localStorage
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];

//Identifier les items du localStorage dans l'API grâce à l'ID        
        for (let i = 0; i < data.length; i++) {
            if (data[i]._id == item.id) {
                let itemDetails = data[i];


//Créer et configurer un nouvel article pour chaque item                
                let newArticle = document.createElement('article');
                newArticle.setAttribute('class', 'cart__item');
                newArticle.setAttribute('data-id', itemDetails._id);
                newArticle.setAttribute('data-color', item.colors);
                newArticle.innerHTML = `
                        <div class="cart__item__img">
                            <img src="${itemDetails.imageUrl}" alt="${itemDetails.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${itemDetails.name}</h2>
                                <p>${item.colors}</p>
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
                totalQuantityIni = parseInt(totalQuantityIni) + parseInt(item.quantity);


//Mettre à jour les totaux                
/*                totalQuantity += parseInt(item.quantity);
                totalPrice += (itemDetails.price * item.quantity);
                const totalQuantityElement = document.querySelector('#totalQuantity');
                totalQuantityElement.innerHTML = totalQuantity;
                const totalPriceElement = document.querySelector('#totalPrice');
                totalPriceElement.innerHTML = totalPrice;
*/            }//)
        }
    }

//Actualiser les quantités
    const itemQuantityElements = document.querySelectorAll(".itemQuantity");
    const totalQuantityElement = document.querySelector('#totalQuantity');
    totalQuantityElement.innerHTML = totalQuantityIni;
    itemQuantityElements.forEach((itemQuantityElement) => {

        itemQuantityElement.addEventListener("input", (e) => {
            let input = e.target;
            let eQuantity = input.value;
            let eArticle = input.closest(".cart__item");
            let eId = eArticle.getAttribute("data-id");
            let eColors = eArticle.querySelector(".cart__item__content__description p");

            cart.forEach(item => {
                if (item.id == eId && item.colors === eColors.innerText) {
                console.log("Modifions la quantité de cet item dans le localstorage");
                item.quantity = eQuantity;
                localStorage.setItem("cart", JSON.stringify(cart));
                }
            })
            totalQuantityIni = 0;
            cart.forEach(item => {
                totalQuantityIni = parseInt(totalQuantityIni) + parseInt(item.quantity);
                totalQuantityElement.innerHTML = totalQuantityIni;
            })
        })
    })
    totalQuantityElement.innerHTML = totalQuantityIni;


//Activer l'action du boutton Supprimer
    const deleteItemElements = document.querySelectorAll(".deleteItem");
    deleteItemElements.forEach((deleteItemElement) => {
        deleteItemElement.addEventListener("click", (e) => {
            let deleteItem = e.target;
            let eArticle = deleteItem.closest(".cart__item");
            let eId = eArticle.getAttribute("data-id");
            let eColors = eArticle.querySelector(".cart__item__content__description p");
            if (confirm("Voulez-vous vraiment retirer cet article de votre panier?")) {
                let itemIndex = cart.findIndex(i => i.id == eId && i.colors === eColors.innerText);
//                console.log(itemIndex);
                console.log("Supprimons cet item du localstorage :", cart.splice(itemIndex,1));
                eArticle.remove();
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        })
    })

//Afficher les totaux
/*    const totalQuantityElement = document.querySelector('#totalQuantity');
    let totalQuantity = 0;
    itemQuantityElements.forEach((itemQuantityElement) => {
        totalQuantity = totalQuantity += parseInt(itemQuantityElement.value);
        totalQuantityElement.innerHTML = totalQuantity;
    })
    const totalPriceElement = document.querySelector('#totalPrice');
*/

});

//Erreurs
const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
const addressErrorMsg = document.querySelector('#addressErrorMsg');
const cityErrorMsg = document.querySelector('#cityErrorMsg');
const emailErrorMsg = document.querySelector('#emailErrorMsg');