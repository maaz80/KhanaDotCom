
const navMenu = document.getElementById('nav-menu');
const filterMenu = document.getElementById('filter-menu');
const SignupMenu = document.getElementById('sign-menu');

document.getElementById('menu-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    navMenu.classList.toggle('show');
    filterMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
});

document.getElementById('filter-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    filterMenu.classList.toggle('show');
    navMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
});

document.getElementById('signup-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    SignupMenu.classList.toggle('show');
    navMenu.classList.remove("show");
    filterMenu.classList.remove("show");
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

        // Details.js
        document.getElementById('next').addEventListener('click', function (event) {
        event.preventDefault();
        const orderForm = document.getElementById('orderForm');

        if (orderForm.checkValidity()) {
            document.getElementById('orderForm').style.display = "none";
            document.getElementById('paymentform').style.display = "block";
        } else {
            // This will trigger the default validation error messages
            orderForm.reportValidity();
        }
    });

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


        document.getElementById('paymentform').addEventListener('submit', function (event) {
            event.preventDefault();
            const paymentOption = getSelectedPaymentOption();
            if (validatePayment()) {
                submitdetails(paymentOption);
            } else {
                alert("Please fill at least one payment option.");
            }
        });
        const validatePayment = () => {
            const Card = document.getElementById('Card').value;
            const Expiry = document.getElementById('Expiry').value;
            const cvv = document.getElementById('cvv').value;
            const upi = document.getElementById('upi').value;
            const Cod = document.getElementById('Cod').checked;

            return (Card && Expiry && cvv) || upi || Cod;
        }

        function getSelectedPaymentOption() {
            if (document.getElementById('Card').value && document.getElementById('Expiry').value && document.getElementById('cvv').value) {
                return 'Credit/Debit Card';
            } else if (document.getElementById('upi').value) {
                return 'UPI';
            } else if (document.getElementById('Cod').checked) {
                return 'Cash On Delivery';
            }
        }


        function submitdetails(paymentOption) {
            const name = document.getElementById("name").value;
            const number = document.getElementById("number").value;
            const email = document.getElementById("email").value;
            const address = document.getElementById("address").value;
            const orderDate = new Date().toISOString(); // Get the current date and time

            localStorage.setItem('name', name);
            localStorage.setItem('number', number);
            localStorage.setItem('email', email);
            localStorage.setItem('address', address);
            localStorage.setItem('orderDate', orderDate);
            localStorage.setItem('paymentOption', paymentOption);

            window.location.href = "order.html";
        }

        document.addEventListener("DOMContentLoaded", function () {
            // Function to disable other payment options
            function disableOtherPaymentOptions(input) {
                const Card = document.getElementById('Card');
                const Expiry = document.getElementById('Expiry');
                const cvv = document.getElementById('cvv');
                const upi = document.getElementById('upi');
                const Cod = document.getElementById('Cod');

                if (input === Card || input === Expiry || input === cvv) {
                    upi.disabled = Cod.disabled = input.value;

                } else if (input === upi) {
                    Card.disabled = Expiry.disabled = cvv.disabled = input.value;
                    Cod.disabled = input.value;
                } else if (input === Cod) {
                    Card.disabled = Expiry.disabled = cvv.disabled = upi.disabled = input.checked;
                }
            }

            // Event listeners for input fields
            const Card = document.getElementById('Card');
            const Expiry = document.getElementById('Expiry');
            const cvv = document.getElementById('cvv');
            const upi = document.getElementById('upi');
            const Cod = document.getElementById('Cod');

            Card.addEventListener('input', function () {
                disableOtherPaymentOptions(this);
            });

            Expiry.addEventListener('input', function () {
                disableOtherPaymentOptions(this);
            });

            cvv.addEventListener('input', function () {
                disableOtherPaymentOptions(this);
            });

            upi.addEventListener('input', function () {
                disableOtherPaymentOptions(this);
            });

            Cod.addEventListener('change', function () {
                disableOtherPaymentOptions(this);
            });
        });
