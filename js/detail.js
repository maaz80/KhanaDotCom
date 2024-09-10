let baseURL = 'http://13.201.28.236:8000'

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
        let response = await fetch(`http://13.201.28.236:8000/api/restaurants/${restaurant_id}/menu/`);

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
                    <img src="${baseURL + itemData.image}" alt="${itemData.name}" />
                    <div class="item-data">
                        <h3>${itemData.name}</h3>
                        <p>${itemData.description}</p>
                        <p>Price: ₹${itemData.price}</p>
                         <div class="quantity">
                            <button id='minus'>-</button>
                            <div id='count'>1</div>
                            <button id='plus'>+</button>
                        </div>
                    </div>
                </div>
            `;

            itemDetailsCont.innerHTML += itemDetails;
            quantityControl()
        } else {
            console.error('Item not found');
            document.getElementById('item-details').innerText = 'Item not found';
        }
    } catch (error) {
        console.error('Error occurred: ' + error.message);
        document.getElementById('item-details').innerText = 'An error occurred while fetching item details';
    }
}
// Quantity 
function quantityControl() {
    let quantityInput = document.getElementById('quantity-input')
    let minus = document.getElementById('minus')
    let plus = document.getElementById('plus')
    let count = document.getElementById('count')

    function updatedQuantity(newValue) {
        count.innerText = newValue;
        quantityInput.value = newValue;
    }
    plus.addEventListener('click', function () {
        let currentvalue = parseInt(count.innerText)
        updatedQuantity(currentvalue + 1)
    })
    minus.addEventListener('click', function () {
        let currentvalue = parseInt(count.innerText)
        if (currentvalue > 1) {
            updatedQuantity(currentvalue - 1)
        }
    })
    quantityInput.value = parseInt(count.innerHTML)

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
