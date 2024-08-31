//menupage
const baseURL = 'http://13.201.28.236:8000';
document.addEventListener('DOMContentLoaded', () => {
  fetchRestaurants();
});

async function fetchRestaurants() {

  try {
    const response = await fetch('http://13.201.28.236:8000/api/restaurants/', {
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

  const modal = document.getElementById('restaurant-modal');
  modal.style.display = "block";

    // Handle "View Menu" button click
    const viewMenuButton = document.getElementById('open-menu-button');
    viewMenuButton.onclick = () => {
      window.location.href=`menu.html?restaurant_id=${restaurant.id}`;
    };
}

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
  }, 3000); // Changes slide every 5 seconds
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


