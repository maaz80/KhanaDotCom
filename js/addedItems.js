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
        console.log('Fetched data:', data);
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
                const isAddedToCart = event.currentTarget.dataset.addedToCart === 'true';

                if (isAddedToCart) {
                    removeItem(cartId)
                } else {
                    throw new Error('Item not in cart')
                }
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
    } catch (error) {
        throw new Error('Error removing the item.')
    }
}



fetchAddedItem();