//Récupoération de l'ID produit stocké dans l'URL
let params = (new URL(document.location)).searchParams;
let id = params.get('id');
//console.log(id);

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
    
//    console.log(data);

//Comparaison des ID de l'API à l'ID en localstorage
//    for (let i = 0; i < data.length; i++) {
//        if (data_id == id) {

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
//        }
//    }
});

const boutton = document.querySelector('#addToCart');
const colors = document.querySelector('#colors');
const quantity = document.querySelector('#quantity');

//Fonction appliquée si le panier n'est pas vide
const addOrPush = (cart) => {
    let addNew = true; //On/Off pour ajouter nouvel item, passe en off s'il existe
    cart.forEach(item => {
        if (item.id == id && item.colors === colors.value) {
        console.log("L'item existe déjà dans le panier, incrémentons-le");
        item.quantity = parseInt(item.quantity) + parseInt(quantity.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        addNew = false;
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
};

//Ajout des produits au panier
boutton.addEventListener('click', (e) => {
    if (quantity.value < 1 || quantity.value > 100 || colors.value == "") {
        alert("Veuillez saisir un nombre d'article entre 1 et 100 et choisir une couleur.");
    } else {
//Si le panier est vide, créer tableau en ajoutant les données
        if (!localStorage.getItem('cart')) {
            console.log("Créons le panier!");
            let cart = [{
                id : id,
                quantity : quantity.value,
                colors : colors.value
            }];
            localStorage.setItem("cart", JSON.stringify(cart))
        }
//Si le panier n'est pas vide 
        else{
            console.log("Le panier existe déjà")
            cart = JSON.parse(localStorage.getItem('cart'));
            addOrPush(cart)
        }

    }


/*        cart.push({
            id : id,
            quantity : quantity.value,
            colors : colors.value
        })
        localStorage.setItem("cart", JSON.stringify(cart))
        console.log(objJson);*/
});

