document.addEventListener("DOMContentLoaded", function () {
    const resetForm= document.getElementById("resetForm") as HTMLFormElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const confirmPasswordInput= document.getElementById("confirm-password")as HTMLInputElement;
    const errorMessage= document.getElementById("error-message") as HTMLElement;
  
    if (!resetForm || !passwordInput || !confirmPasswordInput || !errorMessage) {
      console.error("One or more elements not found.");
      return;
    }
  
    resetForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      // Clear previous error message
      errorMessage.textContent = "";
  
      const password: string = passwordInput.value;
      const confirmPassword: string = confirmPasswordInput.value;
  
      // Simple password validation (you can add more checks)
      if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters long.";
        return;
      }
  
      if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
      }
  
      // If validation passes, you can submit the form
      // In this example, we're preventing actual form submission
      // Replace with your own logic to submit the form to the server
      alert("Password reset successful!");
    });
  });
  