


//menupage
const baseURL = 'http://13.201.28.236:8000'; // Define base URL here
document.addEventListener('DOMContentLoaded', () => {
  fetchRestaurants();
});

async function fetchRestaurants() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
      console.error('No access token found');
      return;
  }


  try {
      const response = await fetch('http://13.201.28.236:8000/restaurants/', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          const errorText = await response.text(); // Read response body
          throw new Error(`Network response was not ok: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Log the response
      displayRestaurants(data);
  } catch (error) {
      console.error('Failed to fetch restaurants:', error);
  }
}


function displayRestaurants(restaurants) {
  const categoryElement = document.getElementById('category');
  if (!categoryElement) {
      console.error('Category element not found in the DOM');
      return;
  }

  const baseURL = 'http://13.201.28.236:8000'; // Replace with your base URL
  categoryElement.innerHTML = '';
  restaurants.forEach(restaurant => {
    console.log('name URL:', baseURL + restaurant.address); // Log URL for debugging
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

function openModal(restaurant) {
  document.getElementById('modal-restaurant-name').innerText = restaurant.name || 'N/A';
  document.getElementById('modal-restaurant-image').src = restaurant.image ? baseURL + restaurant.image : '';
  document.getElementById('modal-restaurant-description').innerText = `Description: ${restaurant.description || 'N/A'}`;
  
  const modal = document.getElementById('restaurant-modal');
  modal.style.display = "block";
}

document.querySelector('.close').addEventListener('click', () => {
  const modal = document.getElementById('restaurant-modal');
  modal.style.display = "none";
});

window.onclick = function(event) {
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



