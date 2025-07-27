const API_URL = 'http://localhost:5000/api';// Replace with your actual API URL

// Login form handler
document.getElementById('loginFormElement').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('usernameLogin').value;
    const password = document.getElementById('passwordLogin').value;

    try {
        const response = await fetch(`${API_URL}/login`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login successful!');
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            alert(data.error || 'Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server error. Please make sure the server is running.');
    }
});

// Signup form handler
document.getElementById('signupFormElement').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        username: document.getElementById('usernameSignup').value,
        email: document.getElementById('email').value,
        password: document.getElementById('passwordSignup').value
    };

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Account created successfully! Please login.');
            toggleForms(); // Ensure this function is defined elsewhere in your code
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during signup.');
    }
});
