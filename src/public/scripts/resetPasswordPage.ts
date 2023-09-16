document.addEventListener("DOMContentLoaded", function () {
  const resetForm = document.getElementById("reset-form") as HTMLFormElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement;
  const errorMessage = document.getElementById("emailError") as HTMLElement;

  if (!resetForm || !passwordInput || !confirmPasswordInput || !errorMessage) {
      console.error("One or more elements not found.");
      return;
  }

  resetForm.addEventListener("submit", async function (event) { // Use async here
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
 
      try {
          const response = await fetch("/api/reset-password", {
              method: "POST",
              headers: {        
              "Content-Type": "application/json"
              },
              body: JSON.stringify({password}),
          });

          if (response.status === 200) {
              alert("Password reset link sent!");
          } else {
              alert("Failed to send password reset link");
          }
      } catch (error) {
          console.error("Error sending password reset request:", error);
          alert("Failed to send password reset link");
      }
  });
});
