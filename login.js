const form = document.getElementById('signupForm');
const passwordInput = document.getElementById('password');
const errorDisplay = document.getElementById('password-error');

form.addEventListener('submit', (e) => {
    const password = passwordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,15}$/;

    if (!passwordRegex.test(password)) {
        e.preventDefault(); // Evita que se envíe el formulario
        errorDisplay.style.display = 'block';
    } else {
        errorDisplay.style.display = 'none';
    }
});