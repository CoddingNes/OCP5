//Lire le localStorage
let cart = JSON.parse(localStorage.getItem("cart"));
if (!cart || cart.length == 0) {
    console.log("Le panier est vide");
} else if (cart.length == 1) {
    console.log("Il y a 1 item dans le panier");
} else {
    console.log("Il y a "+ cart.length +" items différents dans le panier");
}

//Tri des items du Cart par ID
function sortCart(x, y){
    if (x.id < y.id) {return -1;}
    if (x.id > y.id) {return 1;}
    return 0;
}
var sortedCart = cart.sort(sortCart);
console.log(sortedCart);

//Fonction masquer le formulaire de commande
function masquerCde(cart) {
    if (!cart || cart.length == 0) {
        const total = document.querySelector(".cart__price");
        const commande = document.querySelector(".cart__order");
        const titrePanier = document.querySelector(".cartAndFormContainer h1");
        titrePanier.innerHTML += " est vide";
        total.style.display = "none";
        commande.style.display = "none";
    }
}

masquerCde(cart);

if (cart) {
    let totalQuantity = 0;
    let totalPrice = 0;

    //Appel ciblé de l'API pour chaque item
    cart.forEach(item => {
    fetch(`http://localhost:3000/api/products/${item.id}`)
    .then((response) => response.json())
    .then((itemDetails) => {

        const cartItems = document.querySelector('#cart__items');

    //Créer et configurer un nouvel article pour chaque item  
        //Création des éléments              
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

        //Agencement des éléments
        cartItems.append(newArticle);
        newArticle.append(cartItemImgElement, cartItemContentElement);
        cartItemImgElement.append(imgElement);
        cartItemContentElement.append(cartItemContentDescriptionElement, cartItemContentSettingsElement);
        cartItemContentDescriptionElement.append(h2Element, pColorElement, pPriceElement);
        cartItemContentSettingsElement.append(cartItemContentSettingsQuantityElement, cartItemContentSettingsDeleteElement);
        cartItemContentSettingsQuantityElement.append(pQuantityElement, inputItemQuantityElement);
        cartItemContentSettingsDeleteElement.append(pDeleteElement);


    //Mise à jour des totaux lors de l'ouverture du panier                
        totalQuantity = parseInt(totalQuantity) + parseInt(item.quantity);
        totalPrice = parseInt(totalPrice) + parseInt(itemDetails.price * parseInt(item.quantity));

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
                deleteItemElement.addEventListener("click", (e) => {
                    let eArticle = e.target.closest(".cart__item");
                    let eId = eArticle.getAttribute("data-id");
                    let eColors = eArticle.querySelector(".cart__item__content__description p").innerText;
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

    })
    })



    //Contrôle du formulaire

    //Sélection des éléments d'entrée du formulaire
    const formPrenomElement = document.querySelector("#firstName");
    const formNomElement = document.querySelector("#lastName");
    const formAdresseElement = document.querySelector("#address");
    const formVilleElement = document.querySelector("#city");
    const formEmailElement = document.querySelector("#email");
    //Sélection des éléments erreurs du DOM
    const firstNameErrorMsgElement = document.querySelector('#firstNameErrorMsg');
    const lastNameErrorMsgElement = document.querySelector('#lastNameErrorMsg');
    const addressErrorMsgElement = document.querySelector('#addressErrorMsg');
    const cityErrorMsgElement = document.querySelector('#cityErrorMsg');
    const emailErrorMsgElement = document.querySelector('#emailErrorMsg');
    //Masques de contrôle des données
    const masquePrenom = /^([a-zçàáâäèéêëìíîïñòóôöùúûü]+( |-|')?([a-zçàáâäèéêëìíîïñòóôöùúûü]+( |-|')?)*[a-zçàáâäèéêëìíîïñòóôöùúûü]+){2,20}$/i;
    const masqueNom = /^([a-zçàáâäèéêëìíîïñòóôöùúûü]+( |-|')?([a-zçàáâäèéêëìíîïñòóôöùúûü]+( |-|')?)*[a-zçàáâäèéêëìíîïñòóôöùúûü]+){2,20}$/i;
    const masqueAdresse = /^([a-zçàáâäèéêëìíîïñòóôöùúûü0-9]+( |-|')?([a-zçàáâäèéêëìíîïñòóôöùúûü0-9]+( |-|')?)*[a-zçàáâäèéêëìíîïñòóôöùúûü0-9]+){2,60}$/i;
    const masqueVille = /[0-9]{5} ([a-zçàáâäèéêëìíîïñòóôöùúûü]+( |-|'|\/)?([a-zçàáâäèéêëìíîïñòóôöùúûü]+( |-|'|\/)?)*[a-zçàáâäèéêëìíîïñòóôöùúûü]+){2,60}/i;
    const masqueEmail = /[a-z0-9_-]+(\.[a-z0-9_-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{1,3}/i;
    //Messages d'erreur
    const prenomErrorText = 'Veuillez saisir un prénom valide (aucun chiffre ni caractère spécial autre que "-")' 
    const nomErrorText = 'Veuillez saisir un nom valide (aucun chiffre ni caractère spécial autre que "-")' 
    const adresseErrorText = 'Veuillez saisir une adresse valide ' 
    const villeErrorText = 'Veuillez saisir une ville valide ' 
    const emailErrorText = 'Veuillez saisir un email valide ' 
/*    //Récupération des données
    let prenom = "";
    let nom = "";
    let adresse = "";
    let ville = "";
    let email = "";*/

    //Fonction d'affichage des erreurs de saisie du formulaire
    function errorText (e, masque, element, message) {
        console.log(masque.test(e.target.value))
        if (!masque.test(e.target.value)) {
            element.innerHTML = message;
        } else {
            element.innerHTML = "";
        }
    }

    //Vérifier les saisies du formulaire
    formPrenomElement.addEventListener("input", (e) => {errorText(e, masquePrenom, firstNameErrorMsgElement, prenomErrorText)});
    formNomElement.addEventListener("input", (e) => {errorText(e, masqueNom, lastNameErrorMsgElement, nomErrorText)});
    formAdresseElement.addEventListener("input", (e) => {errorText(e, masqueAdresse, addressErrorMsgElement, adresseErrorText)});
    formVilleElement.addEventListener("input", (e) => {errorText(e, masqueVille, cityErrorMsgElement, villeErrorText)});
    formEmailElement.addEventListener("change", (e) => {errorText(e, masqueEmail, emailErrorMsgElement, emailErrorText)});

    //Constructor de création d'un contact
    class infoContact {
        constructor(prenom, nom, adresse, ville, email) {
            this.firstName = prenom,
            this.lastName = nom,
            this.address = adresse,
            this.city = ville,
            this.email = email;
        }
    };

    //Fonction de suppression du panier
    const deleteCart = () => {
        delete(cart);
        localStorage.clear();
    };

    //Requête post et réception du n° de commande
    async function sendOrder (contact, products) {
        try {
            let response = await fetch('http://localhost:3000/api/products/order', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({contact, products})
            });
            const result = await response.json();
        //Suppression du panier
            deleteCart();
        //Redirection vers confirmation de commande
            window.location = `confirmation.html?orderId=${result.orderId}`;
            masquerCde(cart);
        }
        catch (error) {
            console.error(error);
        }
    };

    //Lancer la commande
    const commander = document.querySelector('#order');
    commander.addEventListener("click", (e) => {
        e.preventDefault();
        //Créer un objet contact    
        let prenom = formPrenomElement.value;
        let nom = formNomElement.value;
        let adresse = formAdresseElement.value;
        let ville = formVilleElement.value;
        let email = formEmailElement.value;
        if (prenom!=="" && firstNameErrorMsgElement.innerHTML=="" && nom!=="" && lastNameErrorMsgElement.innerHTML=="" && adresse!=="" && addressErrorMsgElement.innerHTML=="" && ville!=="" && cityErrorMsgElement.innerHTML=="" && email!=="" && emailErrorMsgElement.innerHTML=="") {
            let contact = new infoContact (prenom, nom, adresse, ville, email);
        //Créer un array product
            let products = [];
            cart.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    let id = item.id;
                    products.push(id);
                };
            });
        console.log(contact, products);
        //Requête post et réception du n° de commande
        sendOrder(contact, products);
        }
    });

    //}
}

                                                                                
    
    
    
    
    
    
    
