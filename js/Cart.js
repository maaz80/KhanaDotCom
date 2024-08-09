document.addEventListener('DOMContentLoaded', () => {
    // Select all cart items
    const cartItems = document.querySelectorAll('.cart-item');

    // Initialize quantities from localStorage
    cartItems.forEach((item, index) => {
        // Generate a unique key for each cart item using its index
        const itemId = `cartItem_${index}`;
        let quantity = localStorage.getItem(itemId) || 1;

        // Select elements within the cart item
        const increaseBtn = item.querySelector('.increase');
        const decreaseBtn = item.querySelector('.decrease');
        const quantityDisplay = item.querySelector('.quantity');
        const addToCartBtn = item.querySelector('.add-to-cart');

        // Update the displayed quantity
        quantityDisplay.textContent = quantity;

        // Function to update quantity and localStorage
        function updateQuantity(newQuantity) {
            quantity = Math.max(newQuantity, 0);
            quantityDisplay.textContent = quantity;
            localStorage.setItem(itemId, quantity);
        }

        // Event listeners for quantity controls
        increaseBtn.addEventListener('click', () => {
            updateQuantity(parseInt(quantityDisplay.textContent) + 1);
            addToCartBtn.textContent = 'Remove from Cart';
        });

        decreaseBtn.addEventListener('click', () => {
            updateQuantity(parseInt(quantityDisplay.textContent) - 1);
        });

        // Event listener for add/remove to cart button
        addToCartBtn.addEventListener('click', () => {
            if (addToCartBtn.textContent === 'Add to Cart') {
                updateQuantity(parseInt(quantityDisplay.textContent) + 1);
                addToCartBtn.textContent = 'Remove from Cart';
            } else {
                updateQuantity(0);
                addToCartBtn.textContent = 'Add to Cart';
            }
        });
    });
});
