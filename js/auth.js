document.addEventListener("DOMContentLoaded", function () {
    const loginButtons = document.querySelectorAll(".loginButton");

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    loginButtons.forEach((loginButton) => {
        if (isLoggedIn === "true") {
            loginButton.innerHTML = '<a href="#" class="logoutLink">Logout</a>';
        } else {
            loginButton.innerHTML = '<a href="login.html">Login</a>';
        }
    });

    // Add event listeners for logout on each login/logout button
    document.querySelectorAll(".logoutLink").forEach((logoutLink) => {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.setItem("isLoggedIn", "false");
            localStorage.removeItem("accessToken"); 
            localStorage.removeItem("userRole"); 

            // Reset button text to "Login" after logging out
            loginButtons.forEach((loginButton) => {
                loginButton.innerHTML = '<a href="login.html">LogIn</a>';
            });
            window.location.href = "index.html";
        });
    });
});
