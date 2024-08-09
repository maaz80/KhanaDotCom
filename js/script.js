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


//menupage

document.addEventListener('DOMContentLoaded', () => {
    fetchRestaurants();
  });
  
  async function fetchRestaurants() {
    try {
      const response = await fetch('http://13.201.28.236:8000/restaurants/', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIzMDU4OTI1LCJpYXQiOjE3MjMwMDg1MjUsImp0aSI6ImNmNjBlMDlkYmU1ZTQyMWQ4NDk4YjRlZjM3MTI5NjNiIiwidXNlcl9pZCI6NDl9.Hqxv2MvueJ5XUzc5EGfKHy_h7DQgf99wBhsu36B2_J4'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = await response.json();
      displayRestaurants(data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    }
  }
  
  function displayRestaurants(restaurants) {
    const categoryElement = document.getElementById('category');
    if (!categoryElement) {
      console.error('Category element not found in the DOM');
      return;
    }
  
    categoryElement.innerHTML = '';
    restaurants.forEach(restaurant => {
      const div = document.createElement('div');
      div.classList.add('restaurant-item');
      div.innerHTML = `
        <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
        <h3>${restaurant.name}</h3>
      `;
      categoryElement.appendChild(div);
    });
  }
  function displayRestaurants(restaurants) {
    const categoryElement = document.getElementById('category');
    if (!categoryElement) {
      console.error('Category element not found in the DOM');
      return;
    }
  
    const baseURL = 'http://13.201.28.236:8000'; // Replace with your base URL
    categoryElement.innerHTML = '';
    restaurants.forEach(restaurant => {
      const div = document.createElement('div');
      div.classList.add('restaurant-item');
      div.innerHTML = `
        <img src="${baseURL + restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
        <h3>${restaurant.name}</h3>
      `;
      categoryElement.appendChild(div);
    });
  }
  




// index.html

document.addEventListener("DOMContentLoaded", () => {
    const categoryContainer = document.getElementById("category");
    const loader = document.getElementById("loader");

    let currentPage = 1;
    const itemsPerPage = 6;
    const maxItems = 50;

    // Function to load items
    function loadItems(page) {
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, maxItems);

        for (let i = start; i < end; i++) {
            const div = document.createElement("div");
            div.className = "burger";
            div.textContent = "Top rated restaurant " + (i + 1);
            categoryContainer.appendChild(div);
        }

        // Hide the loader if the maximum number of items is reached
        if (end >= maxItems) {
            loader.style.display = "none";
            observer.disconnect();
        }
    }

    // Initial load
    loadItems(currentPage);

    // Observer to load more items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentPage++;
                loadItems(currentPage);
            }
        });
    }, {
        rootMargin: "0px 0px 100px 0px"
    });

    observer.observe(loader);
});



// Details.js
document.getElementById('next').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('orderForm').style.display = "none"
    document.getElementById('paymentform').style.display = "block"
})


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



