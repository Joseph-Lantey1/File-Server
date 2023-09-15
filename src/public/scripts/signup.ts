document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const fullnameInput = document.getElementById('fullname') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const showPasswordCheckbox = document.getElementById('showPassword') as HTMLInputElement;

    form?.addEventListener('submit', (event) => {
        // Check for valid email format
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailInput.value.match(emailRegex)) {
            event.preventDefault();
            alert("Please enter a valid email");
            return;
        }

        // Check if full name is not empty
        if (fullnameInput.value.trim() === "") {
            event.preventDefault();
            alert("Please enter your full name");
            return;
        }

        // Check if password meets the criteria
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordInput.value.match(passwordRegex)) {
            event.preventDefault();
            alert("Password must contain at least 8 characters, one lowercase letter, one uppercase letter, and one number.");
            return;
        }
    });

    showPasswordCheckbox.addEventListener('change', () => {
        passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });

    passwordInput.addEventListener('input', () => {
        if (showPasswordCheckbox.checked) {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });
});
