// Function to load polls
const POLLS_PER_PAGE = 3;
let currentPage = 0;

function loadPolls() {
    const polls = JSON.parse(localStorage.getItem('polls')) || [];
    const pollList = document.getElementById('poll-list');
    pollList.innerHTML = '';

    if (polls.length === 0) {
        pollList.innerText = 'No polls available.';
        return;
    }

    const start = currentPage * POLLS_PER_PAGE;
    const end = start + POLLS_PER_PAGE;
    const currentPolls = polls.slice(start, end);

    currentPolls.forEach((poll, index) => {
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

    document.getElementById('previous-page').disabled = currentPage === 0;
    document.getElementById('next-page').disabled = end >= polls.length;

    // Update page title
    const pageTitle = document.getElementById('page-title');
    pageTitle.textContent = `Polls Page ${currentPage + 1}`;

    // Update URL
    const newUrl = `${window.location.pathname}?page=${currentPage + 1}`;
    history.pushState({ page: currentPage + 1 }, '', newUrl);
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

// Function to change page
function changePage(direction) {
    currentPage += direction;
    loadPolls();
}

// Function to get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

window.onload = function () {
    const pageParam = getQueryParam('page');
    currentPage = pageParam ? parseInt(pageParam, 10) - 1 : 0;
    loadPolls();
};

window.onpopstate = function (event) {
    if (event.state) {
        currentPage = event.state.page - 1;
        loadPolls();
    }
};

// Event listener for submit button
const submitButton = document.getElementById('poll-button');
if (submitButton) {
    submitButton.addEventListener('click', submitAllPolls);
}
