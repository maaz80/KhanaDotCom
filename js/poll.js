// Function to load polls
function loadPolls() {
    const polls = JSON.parse(localStorage.getItem('polls')) || [];
    const pollList = document.getElementById('poll-list');
    pollList.innerHTML = '';

    if (polls.length === 0) {
        pollList.innerText = 'No polls available.';
        return;
    }

    polls.forEach((poll, index) => {
        const pollElement = document.createElement('div');
        pollElement.className = 'poll';

        const questionElement = document.createElement('div');
        questionElement.className = 'poll-question';
        questionElement.innerText = `${index + 1}. ${poll.question}`;

        const optionsContainer = document.createElement('div');
        poll.options.forEach((option, optIndex) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'poll-option';
            optionElement.innerHTML = `<input type="checkbox" id="poll-${poll.id}-option-${optIndex}" name="poll-${poll.id}" value="${option}"> <label for="poll-${poll.id}-option-${optIndex}">${option}</label>`;
            optionsContainer.appendChild(optionElement);
        });

        pollElement.appendChild(questionElement);
        pollElement.appendChild(optionsContainer);

        pollList.appendChild(pollElement);
    });

    const submitButton = document.getElementById('poll-button');
    submitButton.addEventListener('click', submitAllPolls);
}

// Function to submit all polls
function submitAllPolls() {
    const polls = JSON.parse(localStorage.getItem('polls')) || [];
    const selectedPolls = [];

    polls.forEach(poll => {
        const selectedOptions = Array.from(document.querySelectorAll(`input[name="poll-${poll.id}"]:checked`)).map(option => option.value);
        selectedPolls.push({ pollId: poll.id, selectedOptions: selectedOptions });
    });

    // Store selected polls in sessionStorage for displaying in poll-result.html
    sessionStorage.setItem('selectedPolls', JSON.stringify(selectedPolls));

    // Redirect to poll-result.html
    window.location.href = 'poll-result.html';
}

// Load polls when the page loads
window.onload = function () {
    loadPolls();
};


const navMenu = document.getElementById('nav-menu');
const filterMenu = document.getElementById('filter-menu');
const SignupMenu = document.getElementById('sign-menu');

document.getElementById('menu-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    navMenu.classList.toggle('show');
    filterMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
});

document.getElementById('filter-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    filterMenu.classList.toggle('show');
    navMenu.classList.remove("show");
    SignupMenu.classList.remove("show");
});

document.getElementById('signup-toggle').addEventListener('click', function (event) {
    event.stopPropagation();
    SignupMenu.classList.toggle('show');
    navMenu.classList.remove("show");
    filterMenu.classList.remove("show");
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