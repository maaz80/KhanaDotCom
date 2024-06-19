document.addEventListener("DOMContentLoaded", function() {
    const name = localStorage.getItem('name');
    const number = localStorage.getItem('number');
    const email = localStorage.getItem('email');
    const address = localStorage.getItem('address');
    const payment= localStorage.getItem('paymentOption'); 
    const orderDate = new Date(localStorage.getItem('orderDate'));

    document.getElementById("customer-name").textContent = name;
    document.getElementById("customer-email").textContent = email;
    document.getElementById("customer-number").textContent = number;
    document.getElementById("customer-address").textContent = address;
    document.getElementById("payment-mode").textContent = payment;
    document.getElementById("order-date").textContent = orderDate.toLocaleString();

    // Calculate and display how long ago the order was placed
    const timeDiff = Math.floor((new Date() - orderDate) / 1000);
    const minutes = Math.floor(timeDiff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeAgo = '';
    if (days > 0) {
        timeAgo = `${days} days ago`;
    } else if (hours > 0) {
        timeAgo = `${hours} hours ago`;
    } else if (minutes > 0) {
        timeAgo = `${minutes} minutes ago`;
    } else {
        timeAgo = 'just now';
    }

    document.getElementById("time-ago").textContent = timeAgo;
});

document.getElementById('menu-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show');
});
document.getElementById('filter-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    const filterMenu = document.getElementById('filter-menu');
    filterMenu.classList.toggle('show');
});
document.getElementById('signup-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    const SignupMenu = document.getElementById('sign-menu');
    SignupMenu.classList.toggle('show');
});
document.addEventListener('click', function (event) {
    const navMenu = document.getElementById("nav-menu");
    const filterMenu = document.getElementById('filter-menu');
    const SignupMenu = document.getElementById('sign-menu');

    if (!navMenu.contains(event.target) && !filterMenu.contains(event.target) && !SignupMenu.contains(event.target)) {
        navMenu.classList.remove("show");
        filterMenu.classList.remove("show");
        SignupMenu.classList.remove("show");
    }
})




// Menu.html
document.addEventListener('DOMContentLoaded', () => {
// Load the cart count from local storage
let cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;
const cartCounterElement = document.getElementById('itemincart');
cartCounterElement.textContent = cartCount;

const addToCartButtons = document.querySelectorAll('.cart-count');
addToCartButtons.forEach(button => {
let addedToCart = button.getAttribute('data-added-to-cart') === 'true';

button.addEventListener('click', () => {
    if (!addedToCart) {
        cartCount++;
        button.textContent = 'Remove from Cart';
        button.setAttribute('data-added-to-cart', 'true');
    } else {
        cartCount--;
        button.textContent = 'Add to Cart';
        button.setAttribute('data-added-to-cart', 'false');
    }
    addedToCart = !addedToCart;

    // Update the cart count in the DOM and local storage
    cartCounterElement.textContent = cartCount;
    localStorage.setItem('cartCount', cartCount);
});
});
});