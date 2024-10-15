document.addEventListener("DOMContentLoaded", function () {
    const loginButtons = document.querySelectorAll(".loginButton");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("accessToken");

    // Popup elements
    const logoutPopup = document.getElementById("logoutPopup");
    const confirmLogoutButton = document.getElementById("confirmLogout");
    const cancelLogoutButton = document.getElementById("cancelLogout");
    const Signuptoggle = document.getElementById("signup-toggle");

    loginButtons.forEach((loginButton) => {
        if (isLoggedIn === "true") {
            loginButton.innerHTML = '<a href="#" class="logoutLink">Logout</a>';
            Signuptoggle.style.display = 'none'
            try {
                fetch('https://khanadotcom.in:8000/profile-user/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const userType = data.user_type;
                        if (userType === 'restaurant_owner') {
                            const restaurantOwnerLinks = document.querySelector('.restaurant-owner-links');
                            if (restaurantOwnerLinks) restaurantOwnerLinks.style.display = 'flex';
                        }
                        else if (userType === 'customer') {
                            const cartPopup = document.querySelector('.cartCont')
                            if (cartPopup) cartPopup.style.display = 'block'

                            document.addEventListener("menuRendered", function () {
                                const cartButtons = document.querySelectorAll('.Menucart');
                                if (cartButtons.length > 0) {
                                    cartButtons.forEach(button => {
                                        button.style.display = 'block';  // Show cart buttons for customer
                                    });
                                }
                            });
                        }
                    })
                    .catch(error => {
                        console.log('There was an error in fetching the Restaurant owner options: ' + error);
                    });
            } catch (error) {
                console.error('Error occurred during fetching user type:', error);
            }

        } else {
            loginButton.innerHTML = '<a href="login.html">Login</a>';
        }
    });

    // Show popup on logout click
    document.querySelectorAll(".logoutLink").forEach((logoutLink) => {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            logoutPopup.style.display = "block";
        });
    });

    // Confirm logout
    confirmLogoutButton.addEventListener("click", function () {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");

        // Reset button text to "Login" after logging out
        loginButtons.forEach((loginButton) => {
            loginButton.innerHTML = '<a href="login.html">Login</a>';
        });

        window.location.href = "index.html";
    });

    // Cancel logout
    cancelLogoutButton.addEventListener("click", function () {
        logoutPopup.style.display = "none";
    });
});

// Header Toggle Functionality
const navMenu = document.getElementById('nav-menu');
const SignupMenu = document.getElementById('sign-menu');

document.getElementById('menu-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    navMenu.classList.toggle('show');
    SignupMenu.classList.remove("show");
});


document.getElementById('signup-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    SignupMenu.classList.toggle('show');
    navMenu.classList.remove("show");
});

document.addEventListener('click', function (event) {
    if (!navMenu.contains(event.target) && !SignupMenu.contains(event.target)) {
        navMenu.classList.remove("show");
        SignupMenu.classList.remove("show");
    }
});

// Cart Value Management

// Function to add item to the cart
function addToCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.includes(itemId)) {
        cart.push(itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    updateCartCount();
}

// Function to remove item from the cart
function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(id => id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Function to update the cart count
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.querySelector('.cart-count-number');
    const itemInCartElement = document.getElementById('itemincart');

    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }

    if (itemInCartElement) {
        itemInCartElement.textContent = cart.length;
    }
}
document.addEventListener('DOMContentLoaded', updateCartCount);


// Restaurant owner Dashboard toggle
let Dashboard = document.querySelector('.restaurant-owner-links')
let DashboardPopup = document.querySelector('.restaurant-dashboard')
let CloseDashboardPopup = document.querySelector('.close-dash')
let MainContent = document.querySelector('.main-content')
Dashboard.addEventListener('click', function () {
    DashboardPopup.style.display = 'block'
    MainContent.classList.add('blurred')
})
CloseDashboardPopup.addEventListener('click', function () {
    DashboardPopup.style.display = 'none'
    MainContent.classList.remove('blurred')
})

// Multipurpus popup 
function MultiPopup(message, duration = 1500) {
    const MultiPopup = document.createElement('div')
    MultiPopup.className = `MultiPopup`
    MultiPopup.textContent = message;
    document.body.appendChild(MultiPopup)
    MultiPopup.style.display = 'flex'

    setTimeout(() => {
        MultiPopup.style.display = 'none'
        MultiPopup.remove();
    }, duration);
}