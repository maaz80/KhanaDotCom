let cartItems = [];

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
        const totalAmountCont = document.querySelector('.totalAmountCont')
        ItemCount.innerHTML = `${data.items.length} Items added in cart.`
        totalAmountCont.innerHTML = `
         <div class="PaymentContainer">
             <div class='PaymentOptionsButton'>Payment Options </div>
                <div class="list">
                    <li>Credit/Debit Card</li>
                    <li>PayPal</li>
                    <li>UPI</li>
                    <li>COD</li>
                </div>
         </div>
        <div class='amount'>Total: ₹${data.total_amount}</div> `
        console.log(data);

        addedItemsCont.innerHTML = '';

        // Access the items array in the data object
        const items = data.items;

        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                const imageUrl = `https://khanadotcom.in:8000${item.menu_item.menu_item_pic}`
                itemDiv.innerHTML = `
                <div class='cart-list-item ' id='detailsPage-${item.id}'>
                 <img src='${imageUrl}' alt='Item Pic' class='cartItemImage'/>
                <div class='cart-list-item-details'>
                  <h3>${item.menu_item.name}</h3>
                  <div class='quantityContainer'>
                    <div>Quantity:</div> 
                     <div class='quantity'>
                      <button class='minus poppins-regular' data-id='${item.id}' id='minus-${item.id}'>-</button>
                      ${item.quantity}
                      <button class='plus poppins-regular' data-id='${item.id}' id='plus-${item.id}'>+</button>
                     </div>
                    </div>
                    <p>Total Price: ₹${item.total_price}</p>
                    <button class='removeItem poppins-regular' data-cart-id='${item.id}' data-added-to-cart='true'>Remove</button>
                </div>
                </div>
                `;

                // Append the item to the container
                addedItemsCont.appendChild(itemDiv);

                // Event Listener for details page from cart 
                document.getElementById(`detailsPage-${item.id}`).addEventListener('click',()=>{
                    window.location.href=`details.html?restaurant_id=${item.menu_item.restaurant}&itemID=${item.menu_item.menu_item_id}`
                })

                // Increasing quantity in cart 
                document.getElementById(`plus-${item.id}`).addEventListener('click', (e) => {
                    const cartId = item.id;
                    const currentQuantity = item.quantity;
                    const newQuantity = currentQuantity + 1;
                    const menuItemId = item.menu_item.menu_item_id;
                    changeQuantity(cartId, menuItemId, newQuantity);
                    e.stopPropagation();
                    MultiPopup('Quantity Increased', 1500);
                });

                // Decreasing quantity in cart 
                document.getElementById(`minus-${item.id}`).addEventListener('click', (e) => {
                    e.stopPropagation();
                    const cartId = item.id;
                    const currentQuantity = item.quantity;
                    const newQuantity = currentQuantity - 1;
                    const menuItemId = item.menu_item.menu_item_id;
                    changeQuantity(cartId, menuItemId, newQuantity);
                    MultiPopup('Quantity Decreased', 1500);
                });
            });
            addRemoveEventListener()
        } else {
            addedItemsCont.innerHTML = '<p>No items found in the cart.</p>';
        }
        // Payment option button listener
        const PaymentOptionsButton = document.querySelector('.PaymentOptionsButton');
        PaymentOptionsButton.addEventListener('click', function () {
            const list = document.querySelector('.list');
            if (list.classList.contains('show')) {
                list.classList.remove('show');
                setTimeout(() => {
                    list.style.display = 'none';
                }, 500);
            } else {
                list.style.display = 'block';
                setTimeout(() => {
                    list.classList.add('show');
                }, 10);
            }
        });

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
                event.stopPropagation();
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
        MultiPopup('Item Removed', 1500)
        await fetchAddedItem()
        await fetchAddedItemForButton()
        const cart = document.querySelector('.Detailscart')
        cart.innerText = 'Add'

    } catch (error) {
        throw new Error('Error removing the item.')
    }

}
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
        console.log(cartItemIds);

        return cartItemIds;

    } catch (error) {
        console.error('Error fetching added items:', error);
    }
}

// Change Quantity in cart function 
async function changeQuantity(cartId, menuItemId, newQuantity) {
    const token = localStorage.getItem('accessToken')
    try {
        const response = await fetch(`https://khanadotcom.in:8000/cart/item/${cartId}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ menu_item_id: menuItemId, quantity: newQuantity })
        })

        if (!response.ok) {
            throw new Error('There was an issue in response')
        }
        await fetchAddedItem();
        await fetchAddedItemForButton()
    } catch (error) {
        throw new Error('Error in fetching the item', error)
    }
}

// Item added Modal 
const addItemModalButton = document.getElementById('added-item-modal-button');
const closeModalButton = document.getElementById('close-modal-button');
const addItemModal = document.getElementById('added-item-modal')
const totalAmountCont = document.querySelector('.totalAmountCont')


addItemModalButton.addEventListener('click', function () {
    addItemModal.style.top = '3px'
    addItemModal.style.transition = '0.5s';
    closeModalButton.style.display = 'block'
    addItemModalButton.style.display = 'none'
    addItemModal.style.overflowY = 'auto'
    totalAmountCont.style.position = 'fixed'
})

closeModalButton.addEventListener('click', function () {
    addItemModal.style.top = ' 93%'
    addItemModal.style.transition = '0.5s';
    closeModalButton.style.display = 'none'
    addItemModalButton.style.display = 'flex'
    addItemModal.style.overflowY = 'hidden'
    totalAmountCont.style.position = 'static'

})

