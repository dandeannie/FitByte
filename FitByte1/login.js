// Constants
const API_URL = 'http://localhost:5000/api';

// Function to toggle between forms
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Add transition classes
    loginForm.style.opacity = '0';
    signupForm.style.opacity = '0';
    
    setTimeout(() => {
        loginForm.classList.toggle('hidden');
        signupForm.classList.toggle('hidden');
        
        // Remove transition classes after switching
        setTimeout(() => {
            loginForm.style.opacity = '';
            signupForm.style.opacity = '';
        }, 50);
    }, 300);
}

// Add event listener for page load to show appropriate form
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('form') === 'signup') {
        toggleForms();
    }
});

// Login form handler
document.getElementById('loginFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
   
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
   
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
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirect to index.html
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
document.getElementById('signupFormElement').addEventListener('submit', async function(e) {
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
            toggleForms();
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during signup');
    }
});