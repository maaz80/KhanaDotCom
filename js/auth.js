document.addEventListener("DOMContentLoaded", function () {
    const loginButtons = document.querySelectorAll(".loginButton");

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    loginButtons.forEach((loginButton) => {
        if (isLoggedIn === "true") {
            loginButton.innerHTML = '<a href="#" class="logoutLink">LogOut</a>';
        } else {
            loginButton.innerHTML = '<a href="login.html">LogIn</a>';
        }
    });

    // Add event listeners for logout on each login/logout button
    document.querySelectorAll(".logoutLink").forEach((logoutLink) => {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.setItem("isLoggedIn", "false"); // Set login state to false

            // Reset button text to "Login" after logging out
            loginButtons.forEach((loginButton) => {
                loginButton.innerHTML = '<a href="login.html">LogIn</a>';
            });
            window.location.href = "index.html";
        });
    });
});
