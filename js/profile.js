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


// Fetch Profile
document.addEventListener("DOMContentLoaded", function () {
    const profileContainer = document.querySelector('.profile');
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert("You need to login first!");
        window.location.href = "login.html";
        return;
    }

    function fetchProfileData(url) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('name').value = data.name;
                document.getElementById('email').value = data.email;
                document.getElementById('phone').value = data.phone_number;
                document.getElementById('address').value = data.address;
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
                alert('Failed to load profile data.');
            });
    }

    // Fetch profile data to determine user role
    fetch('http://13.201.28.236:8000/profile-user/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Profile API call failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let profileUrl = "";
            const userType = data.user_type; // Assume user_type is available in the response
            console.log(userType);

            if (userType === "user") {
                profileUrl = "http://13.201.28.236:8000/profile-user/";
            } else if (userType === "restaurant_owner") {
                profileUrl = "http://13.201.28.236:8000/profile-owner/";
            } else if (userType === "delivery_person") {
                profileUrl = "http://13.201.28.236:8000/profile-delivery-person/";
            } else {
                alert("Unauthorized user type!");
                window.location.href = "login.html";
                return;
            }

            fetchProfileData(profileUrl);
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
            alert('Failed to load user profile.');
        });
});