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

      
        const submitButton= document.getElementById("poll-button")
        submitButton.onclick = () => submitPoll(poll.id);

        pollElement.appendChild(questionElement);
        pollElement.appendChild(optionsContainer);
        pollElement.appendChild(submitButton);

        pollList.appendChild(pollElement);
    });
}

function submitPoll(pollId) {
    const selectedOptions = Array.from(document.querySelectorAll(`input[name="poll-${pollId}"]:checked`)).map(option => option.value);
    if (selectedOptions.length > 0) {
        alert('Poll Submitted.');
    } else {
        alert('Please select one option in each.');
    }
}

window.onload = loadPolls;

const navMenu = document.getElementById('nav-menu');
const filterMenu = document.getElementById('filter-menu');
const SignupMenu = document.getElementById('sign-menu');
const ChatBot = document.getElementById('ChatBot-Box');

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

if (!navMenu.contains(event.target) && !filterMenu.contains(event.target) && !SignupMenu.contains(event.target) ) {
navMenu.classList.remove("show");
filterMenu.classList.remove("show");
SignupMenu.classList.remove("show");
}
})
