//Récupoération de l'ID produit stocké dans l'URL
let params = (new URL(document.location)).searchParams;
let id = params.get('id');
console.log(id);

//Ajout des différents éléments dynamiques sur la page product
const imgNode = document.querySelector('.item__img');
const imgElement = document.createElement('img');
imgNode.appendChild(imgElement);
const titleElement = document.getElementById('title');
const priceElement = document.getElementById('price');
const descriptionElement = document.getElementById('description');
const colorsElement = document.getElementById('colors');
const colorOptions = document.createElement('option');

//Appel de l'APi
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((data) => {
    
//Intégration des données de l'API selon l'ID identifié
    imgElement.setAttribute('src', data.imageUrl);
    imgElement.setAttribute('alt', data.altTxt);
    titleElement.innerHTML = data.name;
    priceElement.innerHTML = data.price;
    descriptionElement.innerHTML = data.description;

//Ajout du nombre d'options correspondant au nombre de couleurs disponibles pour ce produit           
    const productColors = data.colors;
    for (let i = 0; i < productColors.length; i++) {
        const colorOptions = document.createElement('option');
        colorsElement.appendChild(colorOptions);
        colorOptions.setAttribute('value', productColors[i]);
        colorOptions.innerHTML = productColors[i];
    }
});

const boutton = document.querySelector('#addToCart');
const colors = document.querySelector('#colors');
const quantity = document.querySelector('#quantity');

//Ajout des produits au panier
boutton.addEventListener('click', (e) => { 
    if (colors.value == "") {
        alert("Veuillez choisir une couleur.");
    } else if (quantity.value == 0) {
        alert("Attention! Vous n'avez pas saisi de quantité!");
    } else if (quantity.value < 0) {
        alert("Veuillez saisir une quantité valide!");
        quantity.value = 1;
    } else {
//Si le panier est vide, créer tableau en ajoutant les données
        if (!localStorage.getItem('cart')) {
            if (parseInt(quantity.value) > 100) {
                alert("Attention! Vous ne pouvez commander que 100 unités maximum!");
                quantity.value = 100;
            } else {
                console.log("Créons le panier!");
                let cart = [{
                    id : id,
                    quantity : quantity.value,
                    colors : colors.value
                }];
                localStorage.setItem("cart", JSON.stringify(cart))
                alert("Votre produit a bien été ajouté au panier");
            }
        }
//Si le panier n'est pas vide 
        else {
            console.log("Le panier existe déjà")
            cart = JSON.parse(localStorage.getItem('cart'));
            addOrPush(cart)
        }
    }
});


//Fonction appliquée si le panier n'est pas vide
const addOrPush = (cart) => {
    let addNew = true; //True pour ajouter nouvel item, passe en False s'il existe déjà
    let okValue = true; //True pour une valeur saisie correcte, l'ajout au panier est enregistré
    cart.forEach(item => {
        if (item.id == id && item.colors === colors.value) {
            addNew = false;
            if (item.quantity == 100) {
                alert(`Attention! Vous ne pouvez commander que 100 unités maximum.`);
                quantity.value = 1;
                okValue = false;
            } else if ((parseInt(item.quantity) + parseInt(quantity.value)) > 100) {
                alert(`Attention! Vous ne pouvez commander que 100 unités maximum. Vous ne pouvez ajouter que ${100-item.quantity} unités de ce modèle`);
                quantity.value = 100-item.quantity;
                okValue = false;
            } else {
                console.log("L'item existe déjà dans le panier, incrémentons-le");
                item.quantity = parseInt(item.quantity) + parseInt(quantity.value);
            }
        }
    });
    if (addNew) {
        if (parseInt(quantity.value) > 100) {
            alert("Attention! Vous ne pouvez commander que 100 unités maximum!");
            quantity.value = 100;
            okValue = false;
        } else {
            console.log("Ajoutons l'item au panier");
            cart.push({
                id : id,
                quantity : quantity.value,
                colors : colors.value
            });
        }
    };
    if (okValue) {
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Votre produit a bien été ajouté au panier");
    };
};
