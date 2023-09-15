document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    

    // Additional form validation for email and password
    form?.addEventListener('submit', (event) => {
        // Check for valid email format
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailInput.value.match(emailRegex)) {
            event.preventDefault();
            alert("Please enter a valid email");
            return;
        }

        // Check if password is not empty
        if (passwordInput.value.trim() === "") {
            event.preventDefault();
            alert("Please enter your password");
            return;
        }
    });
});

