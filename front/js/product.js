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
    } else {
//Si le panier est vide, créer tableau en ajoutant les données
        if (!localStorage.getItem('cart')) {
            if (quantity.value < 1 || quantity.value > 100 || colors.value == "") {
                alert("Veuillez saisir un nombre d'article entre 1 et 100 et choisir une couleur.");
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
    cart.forEach(item => {
        if (item.id == id && item.colors === colors.value) {
            addNew = false;
            if ((item.quantity + quantity.value) > 100) {
                let retirerItem = (item.quantity + quantity.value) - 100;
                alert(`Le nombre total de cet article doit être compris entre 1 et 100, veuillez retirer au moins ${retirerItem} article(s)`);
            } else if ((item.quantity + quantity.value) < 0) {
                let ajouterItem = (item.quantity + quantity.value);
                alert(`Le nombre total de cet article doit être compris entre 1 et 100, veuillez ajouter au moins ${ajouterItem} article(s)`);
            } else {
                console.log("L'item existe déjà dans le panier, incrémentons-le");
                item.quantity = parseInt(item.quantity) + parseInt(quantity.value);

                localStorage.setItem("cart", JSON.stringify(cart));
            }
        } else if (quantity.value < 1 || quantity.value > 100) {
            alert("Veuillez saisir un nombre d'article entre 1 et 100 et choisir une couleur.");
        } 
    });
    if (addNew) {
        console.log("Ajoutons l'item au panier");
        cart.push({
            id : id,
            quantity : quantity.value,
            colors : colors.value
        });
        localStorage.setItem("cart", JSON.stringify(cart));
    };
    alert("Votre produit a bien été ajouté au panier");
};
