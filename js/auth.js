document.addEventListener("DOMContentLoaded", function () {
    const loginButtons = document.querySelectorAll(".loginButton");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("accessToken");

    // Popup elements
    const logoutPopup = document.getElementById("logoutPopup");
    const confirmLogoutButton = document.getElementById("confirmLogout");
    const cancelLogoutButton = document.getElementById("cancelLogout");

    loginButtons.forEach((loginButton) => {
        if (isLoggedIn === "true") {
            loginButton.innerHTML = '<a href="#" class="logoutLink">Logout</a>';

            try {
                fetch('http://13.201.28.236:8000/profile-user/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const userType = data.user_type;
                    if (userType === 'restaurant_owner') {
                        const restaurantOwnerLinks = document.querySelectorAll('.restaurant-owner-links');
                        restaurantOwnerLinks.forEach(link => {
                            link.style.visibility = 'visible';
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
const filterMenu = document.getElementById('filter-menu');
const SignupMenu = document.getElementById('sign-menu');
const ChatBot = document.getElementById('ChatBot-Box');

document.getElementById('menu-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    navMenu.classList.toggle('show');
    filterMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
    ChatBot.classList.remove("show");
});

document.getElementById('filter-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    filterMenu.classList.toggle('show');
    navMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
    ChatBot.classList.remove("show");
});

document.getElementById('signup-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    SignupMenu.classList.toggle('show');
    navMenu.classList.remove("show");
    filterMenu.classList.remove("show");
    ChatBot.classList.remove("show");
});

document.getElementById('bot-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    ChatBot.classList.toggle("show");
    SignupMenu.classList.remove('show');
    navMenu.classList.remove("show");
    filterMenu.classList.remove("show");
});

document.addEventListener('click', function (event) {
    if (!navMenu.contains(event.target) && !filterMenu.contains(event.target) && !SignupMenu.contains(event.target) && !ChatBot.contains(event.target)) {
        navMenu.classList.remove("show");
        filterMenu.classList.remove("show");
        SignupMenu.classList.remove("show");
        ChatBot.classList.remove("show");
    }
});

// Cart Value Management
document.addEventListener('DOMContentLoaded', () => {
    let cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;
    const cartCounterElement = document.getElementById('itemincart');
    cartCounterElement.textContent = cartCount;

    const addToCartButtons = document.querySelectorAll('.cart-count');

    addToCartButtons.forEach(button => {
        let buttonId = button.getAttribute('data-id');
        buttonId = Number(buttonId);
        let addedToCart = localStorage.getItem(`addedToCart-${buttonId}`) === 'true';

        button.textContent = addedToCart ? 'Remove' : 'Cart';
        button.addEventListener('click', () => {
            if (!addedToCart) {
                cartCount++;
                button.textContent = 'Remove';
                localStorage.setItem(`addedToCart-${buttonId}`, 'true');
            } else {
                cartCount--;
                button.textContent = 'Cart';
                localStorage.setItem(`addedToCart-${buttonId}`, 'false');
            }
            addedToCart = !addedToCart;

            cartCounterElement.textContent = cartCount;
            localStorage.setItem('cartCount', cartCount);
        });
    });
});
