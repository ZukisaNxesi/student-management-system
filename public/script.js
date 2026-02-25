// Handle Signup
const signupForm = document.getElementById('signupForm');
if(signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const res = await fetch('/api/students/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if(res.ok) {
            alert('Signup successful! You can now login.');
            window.location.href = 'login.html';
        } else {
            alert(data.error || 'Signup failed');
        }
    });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const res = await fetch('/api/students/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if(res.ok) {
            alert('Login successful!');
            window.location.href = 'index.html'; // Redirect to main system page
        } else {
            alert(data.error || 'Login failed');
        }
    });
}