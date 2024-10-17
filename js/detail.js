let baseURL = 'https://khanadotcom.in:8000';

document.addEventListener('DOMContentLoaded', async function () {
    let URLParams = new URLSearchParams(window.location.search);
    let restaurant_id = URLParams.get('restaurant_id');
    let itemID = URLParams.get('itemID');
    const inLoggedIn = localStorage.getItem('isLoggedIn')
    const token = localStorage.getItem('accessToken')

    if (restaurant_id && itemID) {
        if (inLoggedIn === 'true') {
            try {
                const response = await fetch(`${baseURL}/profile-user/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    throw new Error('There was a problem in response')
                }
                const data = await response.json()
                const userType = data.user_type;
                if (userType === 'customer') {
                    const cartItemId = await fetchAddedItemForButton()
                    fetchAddedItem()

                    await fetchMenuForCustomer(restaurant_id, itemID, cartItemId)
                } else {
                    await fetchMenu(restaurant_id, itemID);

                }
            } catch (error) {
                throw new Error(error)
            }
        } else {
            await fetchMenu(restaurant_id, itemID);
            console.log('Please login first');
        }
    } else {
        console.error('Restaurant id or item ID not found');
        document.getElementById('item-details').innerText = 'Restaurant id or item ID not found in URL';
    }
});

async function fetchMenuForCustomer(restaurant_id, itemID, cartItemId =[] ) {
    try {
        let response = await fetch(`${baseURL}/api/restaurants/${restaurant_id}/menu/`);

        if (!response.ok) {
            let errorText = await response.text();
            throw new Error('Fetch error: ' + errorText);
        }

        let data = await response.json();
        console.log('Fetched Data:', data);

        const itemIDNumber = Number(itemID);
        const itemData = data.find(item => item.id === itemIDNumber);

        if (itemData) {
            const itemDetailsCont = document.getElementById('item-details');
            const isInCart = cartItemId.includes(itemIDNumber)
            let itemDetails = `
                <div class="restaurant-item">
                <div class="imgsCont">
                    <img class='Main-image' src="${baseURL + itemData.image}" alt="${itemData.name}" />
                    <div class='imgsSubCont'>
                    <img class='Secondary-Image' src="${baseURL + itemData.image}" alt="${itemData.name}" />
                    <img class='Secondary-Image' src="${baseURL + itemData.image}" alt="${itemData.name}" />
                    </div>
                    </div>
                    <div class="item-data">
                        <h3>${itemData.name}</h3>
                        <p>${itemData.description}</p>
                        <p class='price'>Price: ₹${itemData.price}</p>
                        <div class= "all-buttons">
                         <div class="quantityInDetails">
                            <button id='minus'>-</button>
                            <div id='count'>1</div>
                            <button id='plus'>+</button>
                            </div>
                            <button class="Detailscart cart-count poppins-regular" >${isInCart ? 'Add +' : 'Add'}</button>
                            </div>
                        <!-- Rating Form -->
                        <div class="rating-section poppins-regular">
                            <form id="rating-form">
                            <label for="rating">Rate (1-5):</label>
                              <div id="star-rating" class="stars">
                                <i class="fa fa-star" data-value="1" width='100'></i>
                                <i class="fa fa-star" data-value="2"></i>
                                <i class="fa fa-star" data-value="3"></i>
                                <i class="fa fa-star" data-value="4"></i>
                                <i class="fa fa-star" data-value="5"></i>
                              </div>
                                <input type="number" id="rating" min="1" max="5" required />
                                <label for="comment">Comment (optional):</label>
                                <textarea id="comment" rows="3"></textarea>
                                <button type="submit" class='poppins-regular'>Submit Rating</button>
                            </form>
                            <div id="rating-message"></div>
                            <div id="rating-error"></div>
                        </div>
                    </div>
                </div>
            `;

            itemDetailsCont.innerHTML += itemDetails;
            quantityControl();


            // Adding to cart 
            const cart = document.querySelector('.Detailscart')
            if (cart) {
                cart.addEventListener('click', function () {
                    const menuItemId = itemID;
                    console.log(menuItemId);
                    
                    const quantity = parseInt(document.getElementById('count').innerText)
                    addToCart(menuItemId, quantity)
                    const cart = document.querySelector('.Detailscart')
                    cart.innerText='Add +'
                })
            }
            async function addToCart(menuItemId, quantity = 1) {
                const token = localStorage.getItem('accessToken')
                try {
                    const response = await fetch(`${baseURL}/cart/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ menu_item_id: menuItemId, quantity: quantity })
                    })

                    if (!response.ok) {
                        let errorData = await response.json();
                        throw new Error(errorData.error || 'Fetch error');
                    }

                    const data = await response.json()
                    MultiPopup('Item Added', 1500)
                    await fetchAddedItemForButton()
                    await fetchAddedItem()
                } catch (error) {
                    console.log(error);

                }
            }

            // Fill rating input when a star is clicked
            const stars = document.querySelectorAll('.fa-star')
            const ratingInput = document.getElementById('rating')

            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const ratingValue = index + 1;
                    ratingInput.value = ratingValue;

                    // Highlight stars up to the clicked one
                    stars.forEach((s, i) => {
                        if (i < ratingValue) {
                            s.classList.add('highlighted');
                        } else {
                            s.classList.remove('highlighted');
                        }
                    });
                });
            });

            document.getElementById('rating-form').addEventListener('submit', function (event) {
                event.preventDefault();
                submitRating(itemIDNumber);
            });

        } else {
            console.error('Item not found');
            document.getElementById('item-details').innerText = 'Item not found';
        }
    } catch (error) {
        console.error('Error occurred: ' + error.message);
        document.getElementById('item-details').innerText = 'An error occurred while fetching item details';
    }
}


async function fetchMenu(restaurant_id, itemID) {
    try {
        let response = await fetch(`${baseURL}/api/restaurants/${restaurant_id}/menu/`);
        console.log('For non customer');

        if (!response.ok) {
            let errorText = await response.text();
            throw new Error('Fetch error: ' + errorText);
        }

        let data = await response.json();
        console.log('Fetched Data:', data);

        const itemIDNumber = Number(itemID);
        const itemData = data.find(item => item.id === itemIDNumber);

        if (itemData) {
            const itemDetailsCont = document.getElementById('item-details');
            let itemDetails = `
                <div class="restaurant-item">
                <div class="imgsCont">
                    <img class='Main-image' src="${baseURL + itemData.image}" alt="${itemData.name}" />
                    <div class='imgsSubCont'>
                    <img class='Secondary-Image' src="${baseURL + itemData.image}" alt="${itemData.name}" />
                    <img class='Secondary-Image' src="${baseURL + itemData.image}" alt="${itemData.name}" />
                    </div>
                    </div>
                    <div class="item-data">
                        <h3>${itemData.name}</h3>
                        <p>${itemData.description}</p>
                        <p class='price'>Price: ₹${itemData.price}</p>
                        <div class= "all-buttons">
                         <div class="quantity">
                            <button id='minus'>-</button>
                            <div id='count'>1</div>
                            <button id='plus'>+</button>
                            </div>
                            </div>
                        <!-- Rating Form -->
                        <div class="rating-section poppins-regular">
                            <form id="rating-form">
                            <label for="rating">Rate (1-5):</label>
                              <div id="star-rating" class="stars">
                                <i class="fa fa-star" data-value="1" width='100'></i>
                                <i class="fa fa-star" data-value="2"></i>
                                <i class="fa fa-star" data-value="3"></i>
                                <i class="fa fa-star" data-value="4"></i>
                                <i class="fa fa-star" data-value="5"></i>
                              </div>
                                <input type="number" id="rating" min="1" max="5" required />
                                <label for="comment">Comment (optional):</label>
                                <textarea id="comment" rows="3"></textarea>
                                <button type="submit" class='poppins-regular'>Submit Rating</button>
                            </form>
                            <div id="rating-message"></div>
                            <div id="rating-error"></div>
                        </div>
                    </div>
                </div>
            `;

            itemDetailsCont.innerHTML += itemDetails;
            quantityControl();

            // Fill rating input when a star is clicked
            const stars = document.querySelectorAll('.fa-star')
            const ratingInput = document.getElementById('rating')

            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const ratingValue = index + 1;
                    ratingInput.value = ratingValue;

                    // Highlight stars up to the clicked one
                    stars.forEach((s, i) => {
                        if (i < ratingValue) {
                            s.classList.add('highlighted');
                        } else {
                            s.classList.remove('highlighted');
                        }
                    });
                });
            });

            document.getElementById('rating-form').addEventListener('submit', function (event) {
                event.preventDefault();
                submitRating(itemIDNumber);
            });

        } else {
            console.error('Item not found');
            document.getElementById('item-details').innerText = 'Item not found';
        }
    } catch (error) {
        console.error('Error occurred: ' + error.message);
        document.getElementById('item-details').innerText = 'An error occurred while fetching item details';
    }
}

async function submitRating(menuItemId) {
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;
    const token = localStorage.getItem('accessToken');

    if (!token) {
        document.getElementById('rating-error').innerText = 'You must be logged in as a customer to rate this item.';
        return;
    }

    try {
        const response = await fetch(`${baseURL}/menu/${menuItemId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                rating: parseFloat(rating),
                comment: comment
            })
        });

        if (!response.ok) {
            let errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit rating');
        }

        let result = await response.json();
        document.getElementById('rating-message').innerText = `Success: ${result.success}. New average rating: ${result.menu_item_average_rating}`;
        document.getElementById('rating-form').style.display = 'none'
    } catch (error) {
        document.getElementById('rating-error').innerText = 'Error: ' + error.message;
    }
}




// Quantity 
function quantityControl() {
    let minus = document.getElementById('minus');
    let plus = document.getElementById('plus');
    let count = document.getElementById('count');
    let price = document.querySelector('.price');

    // Extract the base price once
    let basePrice = parseFloat(price.innerText.replace('Price: ₹', ''));

    function updatePrice(newValue) {
        let totalPrice = basePrice * newValue;
        price.innerText = `Price: ₹${totalPrice.toFixed(2)}`;
    }

    function updatedQuantity(newValue) {
        count.innerText = newValue;
        updatePrice(newValue);
    }

    plus.addEventListener('click', function () {
        let currentValue = parseInt(count.innerText);
        let newValue = currentValue + 1;
        updatedQuantity(newValue);
    });

    minus.addEventListener('click', function () {
        let currentValue = parseInt(count.innerText);
        if (currentValue > 1) {
            let newValue = currentValue - 1;
            updatedQuantity(newValue);
        }
    });
}

