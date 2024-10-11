
    let cartItems = []; // Initialize cartItems as an empty array

const addedItemsCont = document.querySelector('.addedItem');
async function fetchAddedItem() {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`https://khanadotcom.in:8000/cart/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        const data = await response.json();

        // Cart Count 
        const ItemCount = document.querySelector('.itemCount')
        ItemCount.innerHTML = `${data.items.length} Items added in cart.`
        addedItemsCont.innerHTML = '';

        // Access the items array in the data object
        const items = data.items;

        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                const imageUrl = `https://khanadotcom.in:8000${item.menu_item.menu_item_pic}`
                itemDiv.innerHTML = `
                <div class='cart-list-item'>
                <img src='${imageUrl}' alt='Item Pic' class='cartItemImage'/>
                <div class='cart-list-item-details'>
                <h3>${item.menu_item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Total Price: ₹${item.total_price}</p>
                <button class='removeItem poppins-regular' data-cart-id='${item.id}' data-added-to-cart='true'>Remove</button>
                </div>
                </div>
                `;

                // Append the item to the container
                addedItemsCont.appendChild(itemDiv);
            });
            addRemoveEventListener()
        } else {
            addedItemsCont.innerHTML = '<p>No items found in the cart.</p>';
        }

    } catch (error) {
        console.error('Error fetching added items:', error);
        addedItemsCont.innerHTML = '<p>Error fetching cart items. Please try again later.</p>';
    }
}

// remove Item function 
function addRemoveEventListener() {
    const removeButton = document.querySelectorAll('.removeItem')

    if (removeButton.length > 0) {
        removeButton.forEach(button => {
            button.addEventListener('click', (event) => {
                const cartId = event.currentTarget.dataset.cartId;
                removeItem(cartId)
                fetchAddedItem()
                fetchAddedItemForButton()
            })
        })
    } else {
        console.error('No remove buttons found.');
    }
}

async function removeItem(cartId) {
    const token = localStorage.getItem('accessToken')
    try {
        const response = await fetch(`https://khanadotcom.in:8000/cart/item/${cartId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error('Error is response')
        }

        fetchAddedItem()
        // Fetching menu on remove item 
        const restaurant_id = localStorage.getItem('restaurant_id');
        const cartItemIds = await fetchAddedItemForButton();
        fetchMenu(restaurant_id, cartItemIds);

    } catch (error) {
        throw new Error('Error removing the item.')
    }
}

// To render Button from Add to Add+
async function fetchAddedItemForButton() {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`https://khanadotcom.in:8000/cart/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        const data = await response.json();

        const cartItemIds = data.items.map(item => item.menu_item.menu_item_id); 
        return cartItemIds; 
        
    } catch (error) {
        console.error('Error fetching added items:', error);
    }
}
fetchAddedItem();
fetchAddedItemForButton()



// Item added Modal 
const addItemModalButton = document.getElementById('added-item-modal-button');
const closeModalButton = document.getElementById('close-modal-button');
const addItemModal = document.getElementById('added-item-modal')

addItemModalButton.addEventListener('click', function () {
    addItemModal.style.top = '3px'
    addItemModal.style.transition = '0.5s';
    closeModalButton.style.display = 'block'
    addItemModalButton.style.display = 'none'
    addItemModal.style.overflowY = 'auto'
})

closeModalButton.addEventListener('click', function () {
    addItemModal.style.top = ' 93%'
    addItemModal.style.transition = '0.5s';
    closeModalButton.style.display = 'none'
    addItemModalButton.style.display = 'flex'
    addItemModal.style.overflowY = 'hidden'

})
