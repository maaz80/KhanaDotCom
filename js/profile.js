document.getElementById('menu-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show');
});
document.getElementById('filter-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    const filterMenu = document.getElementById('filter-menu');
    filterMenu.classList.toggle('show');
});
document.getElementById('signup-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    const SignupMenu = document.getElementById('sign-menu');
    SignupMenu.classList.toggle('show');
});
document.addEventListener('click', function (event) {
    const navMenu = document.getElementById("nav-menu");
    const filterMenu = document.getElementById('filter-menu');
    const SignupMenu = document.getElementById('sign-menu');

    if (!navMenu.contains(event.target) && !filterMenu.contains(event.target) && !SignupMenu.contains(event.target)) {
        navMenu.classList.remove("show");
        filterMenu.classList.remove("show");
        SignupMenu.classList.remove("show");
    }
})



// Menu.html
document.addEventListener('DOMContentLoaded', () => {
    // Load the cart count from local storage
    let cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;
    const cartCounterElement = document.getElementById('itemincart');
    cartCounterElement.textContent = cartCount;

    const addToCartButtons = document.querySelectorAll('.cart-count');
    addToCartButtons.forEach(button => {
        let addedToCart = button.getAttribute('data-added-to-cart') === 'true';

        button.addEventListener('click', () => {
            if (!addedToCart) {
                cartCount++;
                button.textContent = 'Remove from Cart';
                button.setAttribute('data-added-to-cart', 'true');
            } else {
                cartCount--;
                button.textContent = 'Add to Cart';
                button.setAttribute('data-added-to-cart', 'false');
            }
            addedToCart = !addedToCart;

            // Update the cart count in the DOM and local storage
            cartCounterElement.textContent = cartCount;
            localStorage.setItem('cartCount', cartCount);
        });
    });
});

function saveProfile() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const creditCardNumber = document.getElementById('credit-card-number').value;
    const creditCardName = document.getElementById('credit-card-name').value;
    const creditCardExpiry = document.getElementById('credit-card-expiry').value;
    const creditCardCvv = document.getElementById('credit-card-cvv').value;
    const billingAddress = document.getElementById('billing-address').value;
    const paypal = document.getElementById('paypal').value;
    const dietaryPreferences = Array.from(document.getElementById('dietary-preferences').selectedOptions).map(option => option.value);

    const profileData = {
        name,
        email,
        phone,
        address,
        creditCard: {
            number: creditCardNumber,
            name: creditCardName,
            expiry: creditCardExpiry,
            cvv: creditCardCvv,
            billingAddress
        },
        paypal,
        dietaryPreferences,
        profilePicture: document.getElementById('profile-picture-input').files[0]
    };

    // Save profile data to local storage (or send to server)
    localStorage.setItem('profileData', JSON.stringify(profileData));
    alert('Profile saved successfully!');
}

function loadProfile() {
    const profileData = JSON.parse(localStorage.getItem('profileData'));

    if (profileData) {
        document.getElementById('name').value = profileData.name;
        document.getElementById('email').value = profileData.email;
        document.getElementById('phone').value = profileData.phone;
        document.getElementById('address').value = profileData.address;
        document.getElementById('credit-card-number').value = profileData.creditCard.number;
        document.getElementById('credit-card-name').value = profileData.creditCard.name;
        document.getElementById('credit-card-expiry').value = profileData.creditCard.expiry;
        document.getElementById('credit-card-cvv').value = profileData.creditCard.cvv;
        document.getElementById('billing-address').value = profileData.creditCard.billingAddress;
        document.getElementById('paypal').value = profileData.paypal;

        profileData.dietaryPreferences.forEach(preference => {
            document.querySelector(`#dietary-preferences option[value="${preference}"]`).selected = true;
        });

        // Load profile picture if available
        if (profileData.profilePicture) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('profile-picture').src = e.target.result;
            };
            reader.readAsDataURL(new Blob([profileData.profilePicture]));
        }
    }
}

document.getElementById('profile-picture-input').addEventListener('change', function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('profile-picture').src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
});

document.addEventListener('DOMContentLoaded', loadProfile);