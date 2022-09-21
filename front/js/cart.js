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

//Appel de l'API
/*cart.forEach(item => {
fetch(`http://localhost:3000/api/products/${item.id}`)
*/
fetch(`http://localhost:3000/api/products/`)
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
});



//Erreurs
const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
const addressErrorMsg = document.querySelector('#addressErrorMsg');
const cityErrorMsg = document.querySelector('#cityErrorMsg');
const emailErrorMsg = document.querySelector('#emailErrorMsg');

