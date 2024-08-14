document.addEventListener("DOMContentLoaded", function() {
    const name = localStorage.getItem('name');
    const number = localStorage.getItem('number');
    const email = localStorage.getItem('email');
    const address = localStorage.getItem('address');
    const payment= localStorage.getItem('paymentOption'); 
    const orderDate = new Date(localStorage.getItem('orderDate'));

    document.getElementById("customer-name").textContent = name;
    document.getElementById("customer-email").textContent = email;
    document.getElementById("customer-number").textContent = number;
    document.getElementById("customer-address").textContent = address;
    document.getElementById("payment-mode").textContent = payment;
    document.getElementById("order-date").textContent = orderDate.toLocaleString();

    // Calculate and display how long ago the order was placed
    const timeDiff = Math.floor((new Date() - orderDate) / 1000);
    const minutes = Math.floor(timeDiff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeAgo = '';
    if (days > 0) {
        timeAgo = `${days} days ago`;
    } else if (hours > 0) {
        timeAgo = `${hours} hours ago`;
    } else if (minutes > 0) {
        timeAgo = `${minutes} minutes ago`;
    } else {
        timeAgo = 'just now';
    }

    document.getElementById("time-ago").textContent = timeAgo;
});
