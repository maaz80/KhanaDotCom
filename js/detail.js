// details.js

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Extract the item ID from the URL parameters
        let urlParams = new URLSearchParams(window.location.search);
        let itemID = urlParams.get('id');

        if (itemID) {
            // Fetch the data from the JSON file
            let response = await fetch('js/FoodData.json');

            if (!response.ok) {
                let errorText = await response.text();
                throw new Error('Fetch error: ' + errorText);
            }

            let data = await response.json();
            console.log(data);

            // Find the item with the matching ID
            const itemIDNumber = Number(itemID); // Convert to number if IDs are numeric
            const itemData = data.find(item => item.id === itemIDNumber);
            
            console.log(itemData);
            

            if (itemData) {
                const itemDetailsCont = document.getElementById('item-details');
                
                // Construct HTML for the item details
                let itemDetails = `
                    <div class="restaurant-item">
                        <img src="${itemData.imageUrl}" alt="${itemData.name}" />
                        <div class="item-data">
                            <h3>${itemData.name}</h3>
                            <p>${itemData.location}</p>
                            <p>Opens at ${itemData.openingTime}</p>
                            <p>Min. Order: ${itemData.minimumOrder} | Delivery Fee: ${itemData.deliveryFee}</p>
                            <p><strong>Delivery: ${itemData.discounts.delivery} | Collection: ${itemData.discounts.collection}</strong></p>
                        </div>
                    </div>
                  
                    `;
                
                // Set the HTML content of the item-details container
                itemDetailsCont.innerHTML += itemDetails;
            } else {
                console.error('Item not found');
                document.getElementById('item-details').innerText = 'Item not found';
            }
        } else {
            console.error('No item ID provided');
            document.getElementById('item-details').innerText = 'No item ID provided';
        }
    } catch (error) {
        console.error('Error occurred: ' + error.message);
        document.getElementById('item-details').innerText = 'An error occurred while fetching item details';
    }
});





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
