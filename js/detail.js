let baseURL = 'https://khanadotcom.in:8000';

document.addEventListener('DOMContentLoaded', async function () {
    let URLParams = new URLSearchParams(window.location.search);
    let restaurant_id = URLParams.get('restaurant_id');
    let itemID = URLParams.get('itemID');

    if (restaurant_id && itemID) {
        await fetchMenu(restaurant_id, itemID);
    } else {
        console.error('Restaurant id or item ID not found');
        document.getElementById('item-details').innerText = 'Restaurant id or item ID not found in URL';
    }
});

async function fetchMenu(restaurant_id, itemID) {
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

            let itemDetails = `
                <div class="restaurant-item">
                <div class="imgsCont">
                    <img src="${baseURL + itemData.image}" alt="${itemData.name}" />
                    <div class='imgsSubCont'>
                    <div class='img2'></div>
                    <div class='img3'></div>
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
                            <button class="cart cart-count poppins-regular" >Add</button>
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
        document.getElementById('rating-error').innerText = 'You must be logged in to rate this item.';
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
    let quantityInput = document.getElementById('quantity-input');
    let minus = document.getElementById('minus');
    let plus = document.getElementById('plus');
    let count = document.getElementById('count');
    let price = document.querySelector('.price');

    // Set initial quantity input value
    quantityInput.value = parseInt(count.innerText);

    // Extract the base price once
    let basePrice = parseFloat(price.innerText.replace('Price: ₹', ''));

    function updatePrice(newValue) {
        let totalPrice = basePrice * newValue;
        price.innerText = `Price: ₹${totalPrice.toFixed(2)}`;
    }

    function updatedQuantity(newValue) {
        count.innerText = newValue;
        quantityInput.value = newValue;
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


// Next button
document.getElementById('next').addEventListener('click', function (event) {
    event.preventDefault();
    const orderForm = document.getElementById('orderForm');

    if (orderForm.checkValidity()) {
        document.getElementById('orderForm').style.display = "none";
        document.getElementById('paymentform').style.display = "block";
    } else {
        // This will trigger the default validation error messages
        orderForm.reportValidity();
    }
});

// Payments
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
