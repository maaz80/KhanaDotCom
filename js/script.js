//menupage
const baseURL = 'https://khanadotcom.in:8000';
document.addEventListener('DOMContentLoaded', () => {
  fetchRestaurants();
});

async function fetchRestaurants() {

  try {
    const response = await fetch('https://khanadotcom.in:8000/api/restaurants/', {
      method: 'GET'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    displayRestaurants(data);
  } catch (error) {
    console.error('Failed to fetch restaurants:', error);
  }
}

// Display restaurant
function displayRestaurants(restaurants) {
  const categoryElement = document.getElementById('restaurant-list');
  if (!categoryElement) {
    console.error('Category element not found in the DOM');
    return;
  }

  categoryElement.innerHTML = '';
  restaurants.forEach(restaurant => {
    const div = document.createElement('div');
    div.classList.add('restaurant-item');
    div.innerHTML = `
          <img src="${baseURL + restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
          <h3>${restaurant.name}</h3>
          `;
    div.addEventListener('click', () => openModal(restaurant));
    categoryElement.appendChild(div);
  });
}


// Popup for restaurant details
function openModal(restaurant) {
  document.getElementById('modal-restaurant-name').innerText = restaurant.name || 'N/A';
  document.getElementById('modal-restaurant-image').src = restaurant.image ? baseURL + restaurant.image : '';
  document.getElementById('modal-restaurant-description').innerText = `Description: ${restaurant.description || 'N/A'}`;
  document.getElementById('rating-section').innerHTML = `
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
`

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
    submitRating(restaurant.id);
  });

  // Submit rating
  async function submitRating(restaurant_id) {
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;
    const token = localStorage.getItem('accessToken');

    if (!token) {
      document.getElementById('rating-error').innerText = 'You must be logged in to rate this item.';
      return;
    }

    try {
      const response = await fetch(`${baseURL}/restaurants/${restaurant_id}/rate/`, {
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
      document.getElementById('rating-message').innerText = `Success: ${result.success}. New average rating: ${result.restaurant_average_rating}`;
      document.getElementById('rating-form').style.display = 'none'
    } catch (error) {
      document.getElementById('rating-error').innerText = 'Error: ' + error.message;
    }
  }

  // Model display 
  const modal = document.getElementById('restaurant-modal');
  modal.style.display = "block";

  // Handle "View Menu" button click
  const viewMenuButton = document.getElementById('open-menu-button');
  viewMenuButton.onclick = () => {
    window.location.href = `menu.html?restaurant_id=${restaurant.id}`;
  };
}

// Close model
let closebutton = document.querySelector('.close').addEventListener('click', () => {
  const modal = document.getElementById('restaurant-modal');
  modal.style.display = "none";
});

window.onclick = function (event) {
  const modal = document.getElementById('restaurant-modal');
  if (event.target === modal) {
    modal.style.display = "none";
  }
};


// index.html

document.addEventListener("DOMContentLoaded", () => {
  const categoryContainer = document.getElementById("category");
  const loader = document.getElementById("loader");

  let currentPage = 1;
  const itemsPerPage = 6;
  const maxItems = 50;

  // Function to load items
  function loadItems(page) {
    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, maxItems);

    for (let i = start; i < end; i++) {
      const div = document.createElement("div");
      div.className = "burger";
      div.textContent = "Top rated restaurant " + (i + 1);
      categoryContainer.appendChild(div);
    }

    // Hide the loader if the maximum number of items is reached
    if (end >= maxItems) {
      loader.style.display = "none";
      observer.disconnect();
    }
  }

  // Initial load
  loadItems(currentPage);

  // Observer to load more items
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentPage++;
        loadItems(currentPage);
      }
    });
  }, {
    rootMargin: "0px 0px 100px 0px"
  });

  observer.observe(loader);
});


// Slider
const slides = document.querySelector(".slides");
const slideCount = document.querySelectorAll(".slide").length;
let currentIndex = 0;
let intervalId;

function updateSlider() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function startAutoScroll() {
  intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlider();
  }, 2000); // Changes slide every 5 seconds
}

function pauseAutoScroll() {
  clearInterval(intervalId);
}

function resumeAutoScroll() {
  startAutoScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  startAutoScroll();

  slides.addEventListener("mouseover", pauseAutoScroll);
  slides.addEventListener("mouseout", resumeAutoScroll);
});

// Filter Dropdown 
const filterMenu = document.getElementById('filter-menu');

document.getElementById('filter-toggle').addEventListener('click', function (event) {
  event.stopPropagation();
  filterMenu.classList.toggle('show');
  SignupMenu.classList.remove("show");
  ChatBot.classList.remove("show");
  navMenu.classList.remove("show");

});

document.getElementById('menu-toggle').addEventListener('click', function (event) {
  event.stopPropagation();
  filterMenu.classList.remove("show");
});

document.getElementById('signup-toggle').addEventListener('click', function (event) {
  event.stopPropagation();
  filterMenu.classList.remove("show");
});

document.getElementById('bot-toggle').addEventListener('click', function (event) {
  event.stopPropagation();
  filterMenu.classList.remove("show");
});

document.addEventListener('click', function (event) {
  if (!navMenu.contains(event.target) && !filterMenu.contains(event.target) && !SignupMenu.contains(event.target) && !ChatBot.contains(event.target)) {
    navMenu.classList.remove("show");
    filterMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
    ChatBot.classList.remove("show");
  }
});

