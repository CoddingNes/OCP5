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

/*const addOrPush = (item) => {
    if (item.id == id && item.colors === colors.value) {
        console.log("Il existe déjà dans le panier");
        item.quantity = parseInt(item.quantity) + parseInt(quantity.value);
        localStorage.setItem("cart", JSON.stringify(cart))

    } else {
        console.log("Ajoutons-le au panier");
        cart.push({
            id : id,
            quantity : quantity.value,
            colors : colors.value
        });
        localStorage.setItem("cart", JSON.stringify(cart))
    }
};*/

//Fonction appliquée si le panier n'est pas vide
const addOrPush = (cart) => {
    let addNew = true; //On/Off pour ajouter nouvel item, passe en off s'il existe
    cart.forEach(item => {
        if (item.id == id && item.colors === colors.value) {
        console.log("Il existe déjà dans le panier");
        item.quantity = parseInt(item.quantity) + parseInt(quantity.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        addNew = false;
        }
    });
    if (addNew) {
    console.log("Ajoutons-le au panier");
    cart.push({
        id : id,
        quantity : quantity.value,
        colors : colors.value
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    };
};


boutton.addEventListener('click', (e) => {
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
        console.log("le panier existe déjà")
        cart = JSON.parse(localStorage.getItem('cart'));
//        cart.forEach(addOrPush)
        addOrPush(cart)
    }


/*        cart.push({
            id : id,
            quantity : quantity.value,
            colors : colors.value
        })
        localStorage.setItem("cart", JSON.stringify(cart))
        console.log(objJson);*/
});

