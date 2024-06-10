document.getElementById('menu-toggle').addEventListener('click', function () {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartCounterElement = document.getElementById('itemincart');

    const addToCartButtons = document.querySelectorAll('.cart-count');
    addToCartButtons.forEach(button => {
        let addedToCart = false;
        button.addEventListener('click', () => {
            if (!addedToCart) {
                cartCount++;
                button.textContent = 'Remove from Cart';
            } else {
                cartCount--;
                button.textContent = 'Add to Cart';
            }
            addedToCart = !addedToCart;
            cartCounterElement.textContent = cartCount;
        });
    });
});
