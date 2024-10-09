// Fetch Menu
const baseURL = 'https://khanadotcom.in:8000';

document.addEventListener('DOMContentLoaded', function () {
    let URLParams = new URLSearchParams(window.location.search);
    let restaurant_id = URLParams.get('restaurant_id');
    if (restaurant_id) {
        fetchMenu(restaurant_id);
    } else {
        console.log('Restaurant id not found');
    }
});

async function fetchMenu(restaurant_id) {
    localStorage.setItem('restaurant_id', restaurant_id);
    console.log(restaurant_id);

    try {
        let responseMenu = await fetch(`https://khanadotcom.in:8000/api/restaurants/${restaurant_id}/menu/`, {
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
      console.log('Processing menu item:', item); // Log item being processed
      if (!item.id || !item.image || !item.name || !item.price) {
          console.error('Invalid menu item structure:', item);
          return; // Skip this item if it's not valid
      }

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
                          data-added-to-cart="${isInCart}">${isInCart ? 'Remove' : 'Add'}</button>
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
      button.addEventListener('click', (event) => {
          const menuItemId = event.currentTarget.dataset.id;
          console.log(menuItemId);
          
          const isAddedToCart = event.currentTarget.dataset.addedToCart === 'true';

          if (isAddedToCart) {
              removeFromCart(menuItemId);
              event.currentTarget.innerText = 'Add';
              event.currentTarget.dataset.addedToCart = 'false';
          } else {
              addToCart(menuItemId);
              event.currentTarget.innerText = 'Remove';
              event.currentTarget.dataset.addedToCart = 'true';
          }
      });
  });



async function addToCart(menuItemId, quantity = 1) {
  console.log(menuItemId);
  
  const token = localStorage.getItem('accessToken');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];


  try {
      const response = await fetch(`${baseURL}/cart/`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ menu_item_id: menuItemId, quantity: quantity }),
      });

      if (!response.ok) {
          const error = await response.text();
          console.error('Failed to add to cart:', response.status, error);
          throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      console.log('Item added to cart:', data);
  } catch (error) {
      console.error('Error adding item to cart:', error);
  }
}




function isItemInCart(itemId) {
    return false; 
}

}
// Filter Dropdown 
const filterMenu = document.getElementById('filter-menu');

document.getElementById('filter-toggle').addEventListener('click', function (event) {
  event.stopPropagation();
  filterMenu.classList.toggle('show');
  SignupMenu.classList.remove("show");
  ChatBot.classList.remove("show");
  navMenu.classList.remove("show");

});

document.getElementById('menu-toggle').addEventListener('click', function (event) {
  event.stopPropagation();
  filterMenu.classList.remove("show");
});

document.getElementById('signup-toggle').addEventListener('click', function (event) {
  event.stopPropagation();
  filterMenu.classList.remove("show");
});

document.getElementById('bot-toggle').addEventListener('click', function (event) {
  event.stopPropagation();
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



// Item added Modal 
const addItemModalButton = document.getElementById('added-item-modal-button');
const closeModalButton = document.getElementById('close-modal-button');

addItemModalButton.addEventListener('click', function () {
  const addItemModal = document.getElementById('added-item-modal')
  addItemModal.style.marginTop = ' -10px'
  closeModalButton.style.display='block'
  addItemModalButton.style.display='none'
})

closeModalButton.addEventListener('click', function () {
  const addItemModal = document.getElementById('added-item-modal')
  addItemModal.style.marginTop = ' 660px'
  closeModalButton.style.display='none'
  addItemModalButton.style.display='block'

})