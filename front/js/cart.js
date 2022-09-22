//Lire le localStorage
let cart = JSON.parse(localStorage.getItem("cart"));
console.log("Il y a "+ cart.length +" items différents dans le panier");

//Fonction masquer le formulaire de commande
function masquerCde(cart) {
    if (cart.length == 0) {
        const total = document.querySelector(".cart__price");
        const commande = document.querySelector(".cart__order");
        const titrePanier = document.querySelector(".cartAndFormContainer h1");
        titrePanier.innerHTML += " est vide";
        total.style.display = "none";
        commande.style.display = "none";
    }
}

masquerCde(cart);

let totalQuantity = 0;
let totalPrice = 0;

//Appel de l'API
cart.forEach(item => {
fetch(`http://localhost:3000/api/products/${item.id}`)
  .then((response) => response.json())
  .then((itemDetails) => {

    const cartItems = document.querySelector('#cart__items');

//Créer et configurer un nouvel article pour chaque item                
    let newArticle = document.createElement('article');
    newArticle.setAttribute('class', 'cart__item');
    newArticle.setAttribute('data-id', itemDetails._id);
    newArticle.setAttribute('data-color', item.colors);
    const cartItemImgElement = document.createElement('div');
    cartItemImgElement.className = 'cart__item__img';
    const imgElement = document.createElement('img');
    imgElement.src = itemDetails.imageUrl;
    imgElement.alt = itemDetails.altTxt;
    const cartItemContentElement = document.createElement('div');
    cartItemContentElement.className = 'cart__item__content';
    const cartItemContentDescriptionElement = document.createElement('div');
    cartItemContentDescriptionElement.className = 'cart__item__content__description';
    const h2Element = document.createElement('h2');
    h2Element.innerText = itemDetails.name;
    const pColorElement = document.createElement('p');
    pColorElement.innerText = item.colors;
    const pPriceElement = document.createElement('p');
    pPriceElement.innerText = itemDetails.price;
    const cartItemContentSettingsElement = document.createElement('div');
    cartItemContentSettingsElement.className = 'cart__item__content__settings';
    const cartItemContentSettingsQuantityElement = document.createElement('div');
    cartItemContentSettingsQuantityElement.className = 'cart__item__content__settings__quantity';
    const pQuantityElement = document.createElement('p');
    pQuantityElement.innerText = 'Qté : ';
    const inputItemQuantityElement = document.createElement('input');
    inputItemQuantityElement.type = 'number';
    inputItemQuantityElement.className = 'itemQuantity';
    inputItemQuantityElement.name = 'itemQuantity';
    inputItemQuantityElement.min = '1';
    inputItemQuantityElement.max = '100';
    inputItemQuantityElement.value = item.quantity;
    const cartItemContentSettingsDeleteElement = document.createElement('div');
    cartItemContentSettingsDeleteElement.className = 'cart__item__content__settings__delete';
    const pDeleteElement = document.createElement('p');
    pDeleteElement.className = 'deleteItem';
    pDeleteElement.innerText = 'Supprimer';

    cartItems.append(newArticle);
    newArticle.append(cartItemImgElement, cartItemContentElement);
    cartItemImgElement.append(imgElement);
    cartItemContentElement.append(cartItemContentDescriptionElement, cartItemContentSettingsElement);
    cartItemContentDescriptionElement.append(h2Element, pColorElement, pPriceElement);
    cartItemContentSettingsElement.append(cartItemContentSettingsQuantityElement, cartItemContentSettingsDeleteElement);
    cartItemContentSettingsQuantityElement.append(pQuantityElement, inputItemQuantityElement);
    cartItemContentSettingsDeleteElement.append(pDeleteElement);


/*                newArticle.innerHTML = `
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
                        </div>`*/




    cartItems.appendChild(newArticle);
    totalQuantity = parseInt(totalQuantity) + parseInt(item.quantity);
    totalPrice = parseInt(totalPrice) + parseInt(itemDetails.price * parseInt(item.quantity));
//            }
//        }
//    }

//Mise à jour des totaux lors de l'ouverture du panier                
    const totalQuantityElement = document.querySelector('#totalQuantity');
    totalQuantityElement.innerHTML = totalQuantity;

    const totalPriceElement = document.querySelector("#totalPrice");
    totalPriceElement.innerHTML = totalPrice;

//Mise à jour des totaux lors de la modification des quantités                
    const itemQuantityElements = document.querySelectorAll(".itemQuantity");
    itemQuantityElements.forEach((itemQuantityElement) => {
        itemQuantityElement.addEventListener("input", (e) => {
            let input = e.target;
            let eQuantity = input.value;
            let eArticle = input.closest(".cart__item");
            let eId = eArticle.getAttribute("data-id");
            let eColors = eArticle.querySelector(".cart__item__content__description p");
            let ePrice = eArticle.querySelector(".cart__item__content__description p:nth-of-type(2)").innerText;

            totalQuantity = 0;
            cart.forEach(item => {
                if (item.id == eId && item.colors === eColors.innerText) {
                totalPrice -= (parseInt(ePrice) * item.quantity);
                item.quantity = eQuantity;
                totalPrice += (parseInt(ePrice) * eQuantity);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                totalQuantity = parseInt(totalQuantity) + parseInt(item.quantity);
            })
            totalPriceElement.innerHTML = totalPrice;
            totalQuantityElement.innerHTML = totalQuantity;
        })
    })

//Activer l'action du boutton Supprimer si tous les items du cart sont affichés
    const deleteItemElements = document.querySelectorAll(".deleteItem");
    if(deleteItemElements.length == cart.length) {
        deleteItemElements.forEach((deleteItemElement) => {
            console.log(deleteItemElements)
            deleteItemElement.addEventListener("click", (e) => {
                let eArticle = e.target.closest(".cart__item");
                let eId = eArticle.getAttribute("data-id");
                let eColors = eArticle.querySelector(".cart__item__content__description p").innerText;
                console.log(eColors);
                let indexToDelete = cart.findIndex(i => i.id == eId && i.colors === eColors);
                let ePrice = eArticle.querySelector(".cart__item__content__description p:nth-of-type(2)").innerText;
                let eQuantity = eArticle.querySelector(".cart__item__content__settings__quantity input").value;
                        if (confirm("Voulez-vous vraiment retirer cet article de votre panier?")) {
                            console.log("Supprimons cet item du localstorage :", cart[indexToDelete]);
        //MAJ des totaux                
                            totalPrice -= (parseInt(ePrice) * (parseInt(eQuantity)));
                            totalPriceElement.innerHTML = totalPrice;
                            totalQuantity -= eQuantity;
                            totalQuantityElement.innerHTML = totalQuantity;
        //Suppression de l'item                
                            cart.splice(indexToDelete,1)
                            eArticle.remove();
                            localStorage.setItem("cart", JSON.stringify(cart));
                        }
                        masquerCde(cart);
            })
        });
    }
/*    const deleteItemElements = document.querySelectorAll(".deleteItem");
    deleteItemElements.forEach((deleteItemElement) => {
        deleteItemElement.addEventListener("click", (e) => {
            let eArticle = e.target.closest(".cart__item");
            let eId = eArticle.getAttribute("data-id");
            let eColors = eArticle.querySelector(".cart__item__content__description p").innerText;
            console.log(eColors);
            let indexToDelete = cart.findIndex(i => i.id == eId && i.colors === eColors);
            let ePrice = eArticle.querySelector(".cart__item__content__description p:nth-of-type(2)").innerText;
            let eQuantity = eArticle.querySelector(".cart__item__content__settings__quantity input").value;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id == eId && cart[i].colors === eColors) {
                    if (confirm("Voulez-vous vraiment retirer cet article de votre panier?")) {
                        console.log("Supprimons cet item du localstorage :", cart[indexToDelete]);
//MAJ des totaux                
                        totalPrice -= (parseInt(ePrice) * (parseInt(eQuantity)));
                        totalPriceElement.innerHTML = totalPrice;
                        totalQuantity -= eQuantity;
                        totalQuantityElement.innerHTML = totalQuantity;
//Suppression de l'item                
                        cart.splice(indexToDelete,1)
                        eArticle.remove();
                        localStorage.setItem("cart", JSON.stringify(cart));
                    }
                    masquerCde(cart);
                }
            }
        })
    })*/
//Mise à jour des totaux lors d'une suppression                
/*                eQuantity = 0
                totalQuantity = 0;
                cart.forEach(item => {
                    if (item.id == cart[indexToDelete].id && item.colors === cart[indexToDelete].colors) {
                        totalPrice -= (parseInt(ePrice) * (parseInt(item.quantity)));
                        item.quantity = eQuantity;
                        totalPrice += (parseInt(ePrice) * eQuantity);
                    }
                    totalQuantity = parseInt(totalQuantity) + parseInt(item.quantity);
                })
*/

/*
//Contrôle du formulaire

//Donnée d'entrée du formulaire
    const formPrenom = document.querySelector("#firstName");
    const formNom = document.querySelector("#lastName");
    const formAdresse = document.querySelector("#address");
    const formVille = document.querySelector("#city");
    const formEmail = document.querySelector("#email");
    infoClient = {
        prenom : formPrenom.value,
        nom : formNom.value,
        adresse : formAdresse.value,
        ville : formVille.value,
        email : formEmail.value
    };
*/


  })
})


/*
//Contrôle du formulaire

//Donnée d'entrée du formulaire
    const formPrenom = document.querySelector("#firstName");
    const formNom = document.querySelector("#lastName");
    const formAdresse = document.querySelector("#address");
    const formVille = document.querySelector("#city");
    const formEmail = document.querySelector("#email");
    infoClient = {
        prenom : formPrenom.value,
        nom : formNom.value,
        adresse : formAdresse.value,
        ville : formVille.value,
        email : formEmail.value
    };
*/
/*});*/


/*
//Erreurs
const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
const addressErrorMsg = document.querySelector('#addressErrorMsg');
const cityErrorMsg = document.querySelector('#cityErrorMsg');
const emailErrorMsg = document.querySelector('#emailErrorMsg');

*/








/*fetch(`http://localhost:3000/api/products/`)
  .then((response) => response.json())
  .then((data) => {

    const cartItems = document.querySelector('#cart__items');
    let totalQuantity = 0;
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
//const cartItemImg = document.createElement('div');
                cartItems.appendChild(newArticle);
                totalQuantity = parseInt(totalQuantity) + parseInt(item.quantity);
                totalPrice = parseInt(totalPrice) + parseInt(itemDetails.price * parseInt(item.quantity));
            }
        }
    }

//Mise à jour des totaux lors de l'ouverture du panier                
    const totalQuantityElement = document.querySelector('#totalQuantity');
    totalQuantityElement.innerHTML = totalQuantity;

    const totalPriceElement = document.querySelector("#totalPrice");
    totalPriceElement.innerHTML = totalPrice;

//Mise à jour des totaux lors de la modification des quantités                
    const itemQuantityElements = document.querySelectorAll(".itemQuantity");
    itemQuantityElements.forEach((itemQuantityElement) => {
        itemQuantityElement.addEventListener("input", (e) => {
            let input = e.target;
            let eQuantity = input.value;
            let eArticle = input.closest(".cart__item");
            let eId = eArticle.getAttribute("data-id");
            let eColors = eArticle.querySelector(".cart__item__content__description p");
            let ePrice = eArticle.querySelector(".cart__item__content__description p:nth-of-type(2)").innerText;

            totalQuantity = 0;
            cart.forEach(item => {
                if (item.id == eId && item.colors === eColors.innerText) {
                totalPrice -= (parseInt(ePrice) * item.quantity);
                item.quantity = eQuantity;
                totalPrice += (parseInt(ePrice) * eQuantity);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                totalQuantity = parseInt(totalQuantity) + parseInt(item.quantity);
            })
            totalPriceElement.innerHTML = totalPrice;
            totalQuantityElement.innerHTML = totalQuantity;
        })
    })

//Activer l'action du boutton Supprimer
    const deleteItemElements = document.querySelectorAll(".deleteItem");
    deleteItemElements.forEach((deleteItemElement) => {
        deleteItemElement.addEventListener("click", (e) => {
            let deleteItem = e.target;
            let eArticle = deleteItem.closest(".cart__item");
            let eId = eArticle.getAttribute("data-id");
            let eColors = eArticle.querySelector(".cart__item__content__description p");
            let ePrice = eArticle.querySelector(".cart__item__content__description p:nth-of-type(2)").innerText;
            if (confirm("Voulez-vous vraiment retirer cet article de votre panier?")) {
                let indexToDelete = cart.findIndex(i => i.id == eId && i.colors === eColors.innerText);
                console.log("Supprimons cet item du localstorage :", cart[indexToDelete]);

//Mise à jour des totaux lors d'une suppression                
                eQuantity = 0
                totalQuantity = 0;
                cart.forEach(item => {
                    if (item.id == cart[indexToDelete].id && item.colors === cart[indexToDelete].colors) {
                        totalPrice -= (parseInt(ePrice) * (parseInt(item.quantity)));
                        item.quantity = eQuantity;
                        totalPrice += (parseInt(ePrice) * eQuantity);
                    }
                    totalQuantity = parseInt(totalQuantity) + parseInt(item.quantity);
                })
                totalQuantityElement.innerHTML = totalQuantity;
                totalPriceElement.innerHTML = totalPrice;
                cart.splice(indexToDelete,1)
                eArticle.remove();
                localStorage.setItem("cart", JSON.stringify(cart));
                masquerCde(cart);
            }
        })
    })

    console.log(cart);
*/

