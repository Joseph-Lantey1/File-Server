document.addEventListener("DOMContentLoaded", function () {
    const resetForm = document.getElementById("resetForm") as HTMLFormElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const emailError = document.getElementById("emailError") as HTMLElement;
  
    if (!resetForm || !emailInput || !emailError) {
      console.error("One or more elements not found.");
      return;
    }
  
    resetForm.addEventListener("submit", async function (event) {
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
  
      const response:Response = await fetch("/api/forgotPassword",
      {method: "POST", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email})})

      if(response.status  === 200) {
        alert("Password reset link sent!");
        emailInput.textContent = "";

      } else {
        alert("Failed to send password reset link")
      }
  
    });
  
    // Email validation function
    function isValidEmail(email: string): boolean {
      // Regular expression for basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  });
  