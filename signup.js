document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get input values
    const email = event.target[0].value;
    const phone = event.target[1].value;
    const password = event.target[2].value;

    // Add your signup logic here (e.g., API call)
    console.log('Signup submitted:', { email, phone, password });
    alert('Signup submitted!');
}); 