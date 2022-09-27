let params = (new URL(document.location)).searchParams;
let orderId = params.get('orderId');
//console.log(orderId);

let numeroCommande = document.querySelector('.confirmation p');
numeroCommande.innerText += " " + orderId.replace(/'/g,'');