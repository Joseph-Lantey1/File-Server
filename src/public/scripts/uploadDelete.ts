// Function to fetch and update the file list
async function updateFileList(): Promise<void> {
  try {
    const response = await fetch("/api/getUploadedFiles");
    if (response.ok) {
      const files: Array<{
        id: number;
        filename: string;
        description: string;
        downloads : number;
        emailsent: number
      }> = await response.json();

      // Update the UI with the updated file list
      const fileListContainer = document.getElementById(
        "fileList"
      ) as HTMLDivElement;
      fileListContainer.innerHTML = ""; // Clear the existing list

      files.forEach((file) => {
        const fileElement = document.createElement("div");
        fileElement.innerHTML = `
            <div id="file-${file.id}">
              <p>File Name: ${file.filename}</p>
              <p>Description: ${file.description}</p>
              <p>Downloads: ${file.downloads}</p>
              <p>Email Sent: ${file.emailsent}</p>

            
            </div>
          `;

        // Create a delete button for each file
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
          try {
            const deleteResponse = await fetch(`/api/deleteFile/${file.filename}`, {
              method: "DELETE",
            });

            if (deleteResponse.ok) {
              // Handle success, e.g., show a success message
              console.log("File deleted successfully");
              // Update the file list after deletion
              updateFileList();
            } else {
              // Handle error, e.g., display an error message
              console.error("Error deleting file:", deleteResponse.statusText);
            }
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        });

        fileElement.appendChild(deleteButton);
        fileListContainer.appendChild(fileElement);
      });
    } else {
      // Handle error, e.g., display an error message
      console.error("Error fetching file list:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching file list:", error);
  }
}

// Add an event listener to the file upload form
document.getElementById("uploadForm")?.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the form from submitting via browser default behavior

  const fileInput = document.getElementById("fileInput") as HTMLInputElement;
  const descriptionInput = document.getElementById(
    "fileDescription"
  ) as HTMLInputElement;

  const formData = new FormData();
  if (fileInput.files && fileInput.files.length > 0) {
    formData.append("file", fileInput.files[0]);
  } else {
    console.error("No file selected");
    return; // Or handle this case as needed
  }

  formData.append("description", descriptionInput.value);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      // Handle success, e.g., show a success message
      console.log("File uploaded successfully");

      // Clear the form fields and file input value
      fileInput.value = ""; // Reset the file input
      descriptionInput.value = "";

      // Update the file list after a successful upload
      updateFileList();
    } else {
      // Handle error, e.g., display an error message
      console.error("Error uploading file:", response.statusText);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
});

// Initialize the file list on page load
updateFileList();
