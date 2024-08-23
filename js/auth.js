document.addEventListener("DOMContentLoaded", function () {
    const loginButtons = document.querySelectorAll(".loginButton");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Popup elements
    const logoutPopup = document.getElementById("logoutPopup");
    const confirmLogoutButton = document.getElementById("confirmLogout");
    const cancelLogoutButton = document.getElementById("cancelLogout");

    loginButtons.forEach((loginButton) => {
        if (isLoggedIn === "true") {
            loginButton.innerHTML = '<a href="#" class="logoutLink">Logout</a>';
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
            loginButton.innerHTML = '<a href="login.html">LogIn</a>';
        });

        window.location.href = "index.html";
    });

    // Cancel logout
    cancelLogoutButton.addEventListener("click", function () {
        logoutPopup.style.display = "none"; 
    });
});

// Header
const navMenu = document.getElementById('nav-menu');
const filterMenu = document.getElementById('filter-menu');
const SignupMenu = document.getElementById('sign-menu');
const ChatBot = document.getElementById('ChatBot-Box');

document.getElementById('menu-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    navMenu.classList.toggle('show');
    filterMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
    ChatBot.classList.remove("show")
});

document.getElementById('filter-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    filterMenu.classList.toggle('show');
    navMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
    ChatBot.classList.remove("show")
});

document.getElementById('signup-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    SignupMenu.classList.toggle('show');
    navMenu.classList.remove("show");
    filterMenu.classList.remove("show");
    ChatBot.classList.remove("show")
});
document.getElementById('bot-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    ChatBot.classList.toggle("show")
    SignupMenu.classList.remove('show');
    navMenu.classList.remove("show");
    filterMenu.classList.remove("show");
    
});

document.addEventListener('click', function (event) {
    const navMenu = document.getElementById("nav-menu");
    const filterMenu = document.getElementById('filter-menu');
    const SignupMenu = document.getElementById('sign-menu');
    const ChatBot = document.getElementById('ChatBot-Box');

    if (!navMenu.contains(event.target) && !filterMenu.contains(event.target) && !SignupMenu.contains(event.target) && !ChatBot.contains(event.target)) {
        navMenu.classList.remove("show");
        filterMenu.classList.remove("show");
        SignupMenu.classList.remove("show");
        ChatBot.classList.remove("show")
    }
})



// Cart Value
    document.addEventListener('DOMContentLoaded', () => {
        // Load the cart count from local storage
        let cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;
        const cartCounterElement = document.getElementById('itemincart');
        cartCounterElement.textContent = cartCount;
  
        const addToCartButtons = document.querySelectorAll('.cart-count');
        addToCartButtons.forEach(button => {
          let buttonId = button.getAttribute('id')
          let addedToCart = localStorage.getItem(`addedToCart-${buttonId}`) === 'true';
  
          button.textContent = addedToCart ? 'Remove' : 'Cart'
          button.addEventListener('click', () => {
            if (!addedToCart) {
              cartCount++;
              button.textContent = 'Remove';
              localStorage.setItem(`addedToCart-${buttonId}`, 'true')
            } else {
              cartCount--;
              button.textContent = 'Cart';
              localStorage.setItem(`addedToCart-${buttonId}`, "false")
            }
            addedToCart = !addedToCart;
  
            // Update the cart count in the DOM and local storage
            cartCounterElement.textContent = cartCount;
            localStorage.setItem('cartCount', cartCount);
          });
        });
      });