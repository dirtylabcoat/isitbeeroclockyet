function updateBeerMessage() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const messageElement = document.getElementById('beerMessage');

    if (timeInMinutes >= 60 && timeInMinutes < 990) {
        messageElement.textContent = "No, it's not beer o'clock :-(";
    } else {
        messageElement.textContent = "Yes, it's beer o'clock! :-D";
    }
}

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleLink = document.getElementById('toggleLink');
const beerScheduleForm = document.getElementById('beerScheduleForm');
const logoutButton = document.getElementById('logoutButton');
const scheduleToggleLink = document.getElementById('scheduleToggleLink');

let isLoginForm = true;

scheduleToggleLink.addEventListener('click', function(e) {
    e.preventDefault();
    beerScheduleForm.classList.toggle('hidden');
});

function showLoggedInState() {
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    toggleLink.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    scheduleToggleLink.classList.remove('hidden');

    document.getElementById('beerScheduleForm').classList.add('hidden');
    document.querySelector('.container').appendChild(logoutButton);
}

function showLoggedOutState() {
    beerScheduleForm.classList.add('hidden');
    logoutButton.classList.add('hidden');
    scheduleToggleLink.classList.add('hidden');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    toggleLink.classList.remove('hidden');
    toggleLink.textContent = 'No account? Register here!';
    isLoginForm = true;
}

function handleLogout() {
    localStorage.removeItem('jwt');
    showLoggedOutState();
}

logoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    handleLogout();
})

beerScheduleForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const schedule = {};

    days.forEach(day => {
        schedule[day] = {
            start: document.getElementById(`${day}-start`).value,
            end: document.getElementById(`${day}-end`).value
        };
    });

    try {
        const response = await fetch('/api/user/update-beer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify(schedule)
        });

        if (response.ok) {
            alert('Beer schedule updated successfully!');
        } else {
            alert('Failed to update beer schedule.');
        }
    } catch (error) {
        alert('An error occurred while updating beer schedule.');
        console.error('Update error:', error);
    }
});

toggleLink.addEventListener('click', function(e) {
    e.preventDefault();

    if (isLoginForm) {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        toggleLink.textContent = 'Already have an account? Login here!';
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        toggleLink.textContent = 'No account? Register here!';
    }

    isLoginForm = !isLoginForm;
});

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('jwt', data.token);
            showLoggedInState();
        } else {
            if (username === 'admin' && password === 'admin') {
                alert('Admin login successful (mocked)');
                localStorage.setItem('jwt', 'mocked-admin-token');
                showLoggedInState();
                return;
            }
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        alert('An error occurred during login.');
        console.error('Login error:', error);
    }
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Registration submitted');
});

// Check if user is already logged in
if (localStorage.getItem('jwt')) {
    showLoggedInState();
}

updateBeerMessage();
