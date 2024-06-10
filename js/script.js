document.getElementById('menu-toggle').addEventListener('click', function () {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show');
});

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



// Details.js
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    submitdetails();
});

function submitdetails() {
    const name = document.getElementById("name").value;
    const number = document.getElementById("number").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const orderDate = new Date().toISOString(); // Get the current date and time

    localStorage.setItem('name', name);
    localStorage.setItem('number', number);
    localStorage.setItem('email', email);
    localStorage.setItem('address', address);
    localStorage.setItem('orderDate', orderDate); // Store the order date and time

    window.location.href = "order.html";
}