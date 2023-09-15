document.addEventListener("DOMContentLoaded", function () {
    const resetForm = document.getElementById("resetForm") as HTMLFormElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const emailError = document.getElementById("emailError") as HTMLElement;
  
    if (!resetForm || !emailInput || !emailError) {
      console.error("One or more elements not found.");
      return;
    }
  
    resetForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      // Clear previous error message
      emailError.textContent = "";
  
      const email: string = emailInput.value;
  
      // Simple email validation (you can add more checks)
      if (!email) {
        emailError.textContent = "Email is required.";
        return;
      }
  
      if (!isValidEmail(email)) {
        emailError.textContent = "Invalid email format.";
        return;
      }
  
      // If validation passes, you can submit the form
      // In this example, we're preventing actual form submission
      // Replace with your own logic to submit the form to the server
      alert("Password reset link sent!");
    });
  
    // Email validation function
    function isValidEmail(email: string): boolean {
      // Regular expression for basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  });
  