// Checking user profile on page load
document.addEventListener('DOMContentLoaded', async function () {
    let token = localStorage.getItem('accessToken');
    if (!token) {
        alert("Access token is missing. Please log in.");
        window.location.href = "login.html";
        return;
    }

    fetch('https://khanadotcom.in:8000/profile-user/', {
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
            const userType = data.user_type;
            console.log(userType);

            const restaurantLoginSection = document.getElementById('profile-card');
            const deliveryLoginSection = document.getElementById('formSection');
            const customerLoginSection = document.getElementById('customerLoginSection');


            if (userType === 'restaurant_owner') {
                restaurantLoginSection.style.display = 'block';
                deliveryLoginSection.style.display = 'none';
                customerLoginSection.style.display = 'none';
                fetchProfileDataForOwner();
            } else if (userType === 'delivery_person') {
                deliveryLoginSection.style.display = 'block';
                restaurantLoginSection.style.display = 'none';
                customerLoginSection.style.display = 'none';
                fetchProfileDataForDeliveryPerson();
            } else if (userType === 'customer') {
                customerLoginSection.style.display = 'block';
                deliveryLoginSection.style.display = 'none';
                restaurantLoginSection.style.display = 'none';
                fetchProfileDataForUser();
            } else {
                alert("Unauthorized user type!");
                window.location.href = "login.html";
                return;
            }
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
            alert('Failed to load user profile.');
        });
});

// Function to fetch and populate restaurant owner profile
function fetchProfileDataForOwner() {
    const token = localStorage.getItem("accessToken");

    fetch('https://khanadotcom.in:8000/profile-owner/', {
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
        .then(profileData => {
            populateProfile(profileData);
            console.log(profileData);

        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
            alert('Failed to fetch profile data.');
        });
}

// Function to populate profile data into fields
function populateProfile(profileData) {
    document.getElementById("username1").value = profileData.username || '';
    document.getElementById("name1").value = profileData.name || '';
    document.getElementById("fullname").value = profileData.name || '';
    document.getElementById("email1").value = profileData.email || '';
    document.getElementById("phone1").value = profileData.phone_number || '';
    document.getElementById("address1").value = profileData.address || '';
    document.getElementById("user_type1").value = profileData.user_type || '';
    document.getElementById("aadhaar_card_number1").value = profileData.aadhaar_card_number || '';
}

// Update profile function
let isEditing = false;

function updateOwnerProfile() {
    const fields = document.querySelectorAll('.form-control');
    const updateButton = document.querySelector('.updatebtn');

    if (!isEditing) {
        fields.forEach(field => {
            if (!['email1', 'user_type1'].includes(field.id)) {
                field.removeAttribute('readonly');
            }
        });
        isEditing = true;
        updateButton.textContent = 'Save Profile';
    } else {
        const token = localStorage.getItem("accessToken");
        const userType = document.getElementById("user_type1").value;

        let url;
        let requestBody = {
            username: document.getElementById("username1").value,
            name: document.getElementById("name1").value,
            phone_number: document.getElementById("phone1").value,
            address: document.getElementById("address1").value,
            aadhaar_card_number: document.getElementById("aadhaar_card_number1").value,
        };

        if (userType === "restaurant_owner") {
            url = "https://khanadotcom.in:8000/update-profile-owner/";
        } else if (userType === "delivery_person") {
            url = "https://khanadotcom.in:8000/update-profile-delivery-person/";
            requestBody.vehicle_details = document.getElementById("vehicle-details").value;
        } else {
            url = "https://khanadotcom.in:8000/update-profile-user/";
        }

        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Update API call failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert('Profile updated successfully!');
                fields.forEach(field => {
                    if (!['email1', 'user_type1'].includes(field.id)) {
                        field.setAttribute('readonly', 'readonly');
                    }
                });
                isEditing = false;
                updateButton.textContent = 'Edit Profile';
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert('Failed to update profile.');
            });
    }
}

// Function to fetch delivery person profile
function fetchProfileDataForDeliveryPerson() {
    const token = localStorage.getItem("accessToken");

    fetch("https://khanadotcom.in:8000/profile-delivery-person/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch user profile");
            }
            return response.json();
        })
        .then((data) => {
            document.getElementById("username").value = data.username || "";
            document.querySelector(".form-name").value = data.name || "";
            document.getElementById("email").value = data.email || "";
            document.getElementById("user_type").value = data.user_type || "";
            document.getElementById("name").value = data.name || "";
            document.getElementById("phone_number").value = data.phone_number || "";
            document.getElementById("address").value = data.address || "";
            document.getElementById("aadhaar_card_number").value = data.aadhaar_card_number || "";
            document.getElementById("vehicle_details").value = data.vehicle_details || "";
            document.getElementById("availability_status").value = data.availability_status || "";
            document.getElementById("rating").value = data.rating || "";
        })
        .catch((error) => {
            console.error("Error fetching user profile:", error);
            alert("Failed to fetch delivery person profile.");
        });
}

// Toggle Password Change Section
function togglePasswordChange() {
    const changePasswordSection = document.getElementById("change-password-section");
    let MainContent = document.querySelector('.main-content')
    const formSection = document.querySelector('.form-section')

    if (changePasswordSection.style.display === "none") {
        changePasswordSection.style.display = "block";
        formSection.style.display = 'none'
        MainContent.classList.add('blurred')
    } else {
        changePasswordSection.style.display = "none";
        MainContent.classList.remove('blurred')
        formSection.style.display = 'block'
    }
}

let closepass = document.querySelector('.close-pass')
closepass.addEventListener('click', function () {
    const changePasswordSection = document.getElementById("change-password-section");
    const MainContent = document.querySelector('.main-content')
    const formSection = document.querySelector('.form-section')

    changePasswordSection.style.display = "none";
    MainContent.classList.remove('blurred')
    formSection.style.display = 'block'

})

document.addEventListener('DOMContentLoaded', function () {
    const changePasswordSection = document.getElementById("change-password-section");
    changePasswordSection.style.display = "none";
})

// Function to update delivery person data
function updateDeliveryProfile() {
    const formElements = document.getElementById("userProfileForm").elements;
    const button = document.getElementById("saveButton");

    if (button.innerText === "Change Information") {
        // Enable all form fields for editing
        for (let element of formElements) {
            element.disabled = false;
        }
        button.innerText = "Save";
    } else {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const formData = new FormData(document.getElementById("userProfileForm"));
            const jsonData = {};

            // Convert FormData into a JSON object
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });
            const token = localStorage.getItem('accessToken');
            // Perform the update API call
            fetch("https://khanadotcom.in:8000/update-profile-delivery-person/", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),

            })
                .then((response) => {
                    console.log("Sending data:", jsonData);
                    if (!response.ok) {
                        throw new Error("Failed to save user profile");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Profile saved:", data);

                    // Disable the form fields after saving
                    for (let element of formElements) {
                        element.disabled = true;
                    }

                    button.innerText = "Change Information";
                    alert("Profile updated successfully!");
                })
                .catch((error) => {
                    console.error("Error saving user profile:", error);
                    alert("Failed to update profile. Please try again.");
                });
        } else {
            alert("User not authenticated. Please log in again.");
        }
    }
}

function fetchProfileDataForUser() {
    const profileUrl = "https://khanadotcom.in:8000/profile-user/";
    const updateProfileUrl = "https://khanadotcom.in:8000/update-profile-user/";
    const token = localStorage.getItem('accessToken');

    // Fetch profile information on page load
    fetch(profileUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Profile Information:", data);

            // Handle name splitting safely
            const fullName = data.name || "";
            const nameParts = fullName.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts[1] || "";

            document.getElementById("inputUsername-3").value = data.username || "";
            document.querySelector(".form-name").value = data.name || "";
            document.getElementById("inputEmailAddress-3").value = data.email || "";
            document.getElementById("inputFirstName-3").value = firstName;
            document.getElementById("inputLastName-3").value = lastName;
            document.getElementById("inputPhone-3").value = data.phone_number || "";
            document.getElementById("inputLocation-3").value = data.address || "";

            // Ensure fields are initially not editable
            toggleFormEditable(false);
        })
        .catch((error) => {
            console.error("Failed to fetch profile information:", error);
        });

    const saveEditButton = document.querySelector(".save-edit-btn-3");
    const formElements = document.querySelectorAll("#accountDetails-3 input");

    let isEditMode = false;

    // Function to toggle the readonly attribute on form fields
    const toggleFormEditable = (editable) => {
        formElements.forEach((input) => {
            input.readOnly = !editable;  // Make fields editable or read-only
        });
    };

    // Save profile data to the API
    const saveProfileData = () => {
        const updatedProfile = {
            username: document.getElementById("inputUsername-3").value,
            email: document.getElementById("inputEmailAddress-3").value,
            name: `${document.getElementById("inputFirstName-3").value} ${document.getElementById("inputLastName-3").value}`,
            phone_number: document.getElementById("inputPhone-3").value,
            address: document.getElementById("inputLocation-3").value
        };

        fetch(updateProfileUrl, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProfile)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Profile Updated:", data);
                alert("Profile updated successfully!");
                toggleFormEditable(false);
                saveEditButton.textContent = "Edit";
                isEditMode = false;
            })
            .catch((error) => {
                console.error("Failed to update profile information:", error);
                alert("Failed to update profile. Please try again.");
            });
    };

    // Toggle button functionality for Save/Edit
    saveEditButton.addEventListener("click", () => {
        if (isEditMode) {
            saveProfileData();
        } else {
            toggleFormEditable(true);  // Enable editing
            saveEditButton.textContent = "Save";
            isEditMode = true;
        }
    });
}



// Change Password Function
function changePassword() {
    const token = localStorage.getItem("accessToken");
    const current_password = document.getElementById("current_password").value;
    const new_Password = document.getElementById("new_password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (new_Password !== confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
    }

    fetch("https://khanadotcom.in:8000/change-password/", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            current_password: current_password,
            new_password: new_Password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Password change failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Password changed successfully!');
            togglePasswordChange();  // Return to Account Details view
        })
        .catch(error => {
            console.error('Error changing password:', error);
            alert('Failed to change password.');
        });
}
