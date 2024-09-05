    // Fetch Menu
    const baseURL = 'http://13.201.28.236:8000';
    document.addEventListener('DOMContentLoaded', function () {
      let URLParams = new URLSearchParams(window.location.search)
      let restaurant_id = URLParams.get('restaurant_id')
      if (restaurant_id) {
        fetchMenu(restaurant_id)
      } else {
        console.log('Restaurant id not found');

      }
    })


    async function fetchMenu(restaurant_id) {
      localStorage.setItem('restaurant_id', restaurant_id)
      console.log(restaurant_id);

      try {
        let responseMenu = await fetch(`http://13.201.28.236:8000/api/restaurants/${restaurant_id}/menu/`, {
          method: 'GET'
        });

        if (!responseMenu.ok) {
          let error = await responseMenu.text();
          throw new Error(`The response was not okay: ${responseMenu.statusText} - ${error}`);
        }

        let menuItem = await responseMenu.json();
        console.log(menuItem);

        if (Array.isArray(menuItem) && menuItem.length > 0) {
          displayMenu(menuItem);
        } else {
          console.error('Menu items not found or invalid data format');
        }
      } catch (error) {
        console.error('There was a problem fetching the menu:', error.message);
      }
    }

    function displayMenu(menuItem) {
      const menuContainer = document.getElementById('menu-list');
      if (!menuContainer) {
        console.error('Menu container not found');
        return;
      }
      menuContainer.innerHTML = '';

      menuItem.forEach(item => {
        let restaurant_id = localStorage.getItem('restaurant_id');
        let menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('menu-item');

        // Check if the item is in the cart
        let isInCart = isItemInCart(item.id);

        menuItemDiv.innerHTML = `
      <div class="restaurant-item">
        <img src="${baseURL + item.image}" alt="${item.name}" class="menu-item-image">
        <div class="restaurant-info">
          <h3>${item.name}</h3>
          <p>Description: ${item.description}</p>
          <p>Price: ₹${item.price}</p>
        </div>
        <div class="buttonCont">
          <button class="cart cart-count poppins-regular" 
                  data-id='${item.id}' 
                  data-added-to-cart="${isInCart}">${isInCart ? 'Remove' : 'Cart'}</button>
          <button class='detailsbutton poppins-regular'>
            <a href="details.html?restaurant_id=${restaurant_id}&itemID=${item.id}">Details</a>
          </button>
        </div>
      </div>`;

        menuContainer.appendChild(menuItemDiv);
      });

      // Add event listeners to the cart buttons
      const cartButtons = document.querySelectorAll('.cart');
      cartButtons.forEach(button => {
        button.addEventListener('click', () => {
          const itemId = button.getAttribute('data-id');
          const addedToCart = button.getAttribute('data-added-to-cart') === 'true';

          if (!addedToCart) {
            addToCart(itemId);
            let rmv = button.textContent = 'Remove';
            button.setAttribute('data-added-to-cart', 'true');
          } else {
            removeFromCart(itemId);
            button.textContent = 'Cart';
            button.setAttribute('data-added-to-cart', 'false');
          }

          updateCartCount();
        });
      });
    }

    // Function to check if an item is in the cart
    function isItemInCart(itemId) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      return cart.includes(itemId);
    }

    // Filter Dropdown 
const filterMenu = document.getElementById('filter-menu');

document.getElementById('filter-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    filterMenu.classList.toggle('show');
    navMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
    ChatBot.classList.remove("show");
});

document.addEventListener('click', function (event) {
    if (!navMenu.contains(event.target) && !filterMenu.contains(event.target) && !SignupMenu.contains(event.target) && !ChatBot.contains(event.target)) {
        navMenu.classList.remove("show");
        filterMenu.classList.remove("show");
        SignupMenu.classList.remove("show");
        ChatBot.classList.remove("show");
    }
});