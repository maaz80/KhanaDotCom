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
document.getElementById('menu-toggle').addEventListener('click', function () {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show');
});