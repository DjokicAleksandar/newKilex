window.addEventListener("DOMContentLoaded", function(){
    var navbar = document.querySelector(".navbar").offsetHeight;
    document.querySelector(".imageContainer").style.marginTop = navbar + "px";
})

window.addEventListener("load", function(){
    document.querySelector(".velikaSlika").style.right = "0";
})

//--------------------

const items = document.querySelector(".items");
const arrowBtn = document.querySelectorAll(".shop i")
const firstCardWidth = items.querySelector(".item").offsetWidth;

let isDragging = false, startX, startScrollLeft;

arrowBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        items.scrollLeft += btn.id === "left" ? -(firstCardWidth+15) : firstCardWidth+15;
    })
})

const dragStart = (e) => {
    isDragging = true;
    items.classList.add("dragging");

    startX = e.pageX;
    startScrollLeft = items.scrollLeft;
}

const dragStop = () => {
    isDragging = false;
    items.classList.remove("dragging");
}

const dragging = (e) => {
    if (!isDragging) return;
    items.scrollLeft = startScrollLeft - (e.pageX - startX);
}

items.addEventListener("mousedown", dragStart);
items.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);

//------------------

const emptyCart = document.querySelector(".emptyCart");

const cartBtn = document.querySelector(".icoCart");
const popUp = document.querySelector(".popUpCart");
const cartContent = document.querySelector(".cartContent");

//prikazi
cartBtn.addEventListener("click", () => {
    popUp.classList.add("show");
    popUp.classList.remove("hide");
})

//sakrij
popUp.addEventListener("click", (e) => {
    popUp.classList.add("hide")
    popUp.classList.remove("show");
})

cartContent.addEventListener("click", (e) => {
    e.stopPropagation();
})

//----------
//proizvodi

//button for cart page
let openCartPageBtn = document.querySelector('.openCartPageBtn');
openCartPageBtn.disabled = true;
//-----

let listProductHTML = document.querySelector(".items");
let listCartHTML = document.querySelector(".listCart");
let iconCartNumber = document.querySelector(".cartNumber");
let totalPrice = document.querySelector("#totalPrice");
let listProduct = [];
let carts = [];

//svi proizvodi
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProduct.length > 0)
    {
        listProduct.forEach(product => {
            let newProduct = document.createElement('li');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `<a href="#" class="itemLink">
                        <img src="${product.image}" class="itemImage" draggable="false">
                    </a>
                    <p class="itemBadge"> Trepavice </p>
                    <h2 class="itemName"> ${product.name} </h2>
                    <h3 class="itemPrice"> ${product.price} RSD </h3>
                    <button class="addToCartButton"> DODAJ U KORPU </button>`;
                    
            listProductHTML.appendChild(newProduct)
        })
    }
}
//--
//add to cart
const addToCart = (productId) => {
    let positionThisProductInCart = carts.findIndex((value) => value.productId == productId);
    if (carts.length <= 0)
    {
        carts = [{
            productId: productId,
            quantity: 1
        }]
    }
    else if (positionThisProductInCart < 0)
    {
        carts.push({
           productId: productId,
           quantity: 1 
        })
    }
    else
    {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
}

const addCartToMemory = () => {
    //24:55
}

let cartItemTotal = document.querySelector(".cartItemTotal");
let cartIsEmpty = true;////////

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPriceValue = 0;

    if (carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('cartItem');
            newCart.dataset.id = cart.productId;

            let positionProduct = listProduct.findIndex((value) => value.id == cart.productId);
            let info = listProduct[positionProduct];

            let itemTotalPrice = info.price*cart.quantity;
            totalPriceValue += itemTotalPrice;

            let formattedPrice = itemTotalPrice.toLocaleString('de-DE', {minimumFractionDigits: 0});

            newCart.innerHTML = `<div class="cartItemImage">
                            <img src="${info.image}" width="50px" height="50px">
                        </div>
                        <div class="cartItemName">
                            ${info.name}
                        </div>
                        <div class="cartItemTotal">
                            ${formattedPrice} RSD
                        </div>
                        <div class="quantity">
                            <div class="minus"> - </div>
                            <div class="quantityNumber"> ${cart.quantity} </div>
                            <div class="plus"> + </div>
                        </div>`;
                
            listCartHTML.appendChild(newCart);
        })
        emptyCart.style.display = 'none'; //cart is empty text
        cartIsEmpty = false;//////////////
    }
    else{
        emptyCart.style.display = 'block'; //cart is empty text
        cartIsEmpty = true;///////////////
    }
    iconCartNumber.innerText = totalQuantity;

    let formattedTotalPrice = totalPriceValue.toLocaleString('de-DE', {minimumFractionDigits: 0});
    totalPrice.innerText = `${formattedTotalPrice} RSD`;

    //disable button for cart page
    if (cartIsEmpty)
        openCartPageBtn.disabled = true;
    else
    {
        openCartPageBtn.disabled = false;

        openCartPageBtn.addEventListener('click', () => {
            localStorage.setItem("selectedProducts", JSON.stringify(carts)); //local storage
            localStorage.setItem("allProducts", JSON.stringify(listProduct));
            window.location.href = "cart.html"; 
        })
    }
    //----
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus'))
    {
        let productId = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')){
            type = 'plus';
        }

        changeQuantity(productId, type);
    }
})

const changeQuantity = (productId, type) => {
    let positionItemInCart = carts.findIndex((value) => value.productId == productId);
    if (positionItemInCart >= 0)
    {
        switch(type){
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;

            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }
                else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    //addCartToMemory
    addCartToHTML();
}

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addToCartButton')){
        let productId = positionClick.parentElement.dataset.id;
        addToCart(productId);
    }
})

//data from json
const initApp = () => {
    fetch("products.json")
    .then(response => response.json())
    .then(data => {
        listProduct = data;
        addDataToHTML();
    })
}
initApp();

//-------------
//naplata

//-------
//menu icon

const icoMenu = document.querySelector(".icoMenu");

icoMenu.addEventListener("click", function(){
    window.location.href = "main.html";
})



