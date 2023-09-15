// Define the FileData type for files
interface FileData {
  id: number;
  filename: string;
  description: string;
}

let files: FileData[] = []; // Initialize an empty array to hold files

async function fetchFiles() {
  try {
    // Fetch the list of uploaded files
    const response: Response = await fetch("/getUploadedFiles");

    if (response.ok) {
      // Parse the JSON response into an array of files
      files = await response.json();
      updateFileListAndDownloadFile(); // Populate the file list when files are fetched
    } else {
      console.error("Error fetching file list:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching file list:", error);
  }
}

// Initialize the file list when the page is loaded
fetchFiles();

async function updateFileListAndDownloadFile(searchQuery: string | undefined = ""): Promise<void> {

  // Apply filtering based on the searchQuery
  const filteredFiles:any = files.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clear the existing file list in the UI
  const fileListContainer = document.getElementById("fileList") as HTMLDivElement;
  fileListContainer.innerHTML = "";

  // Process and update the UI with the filtered search results
  filteredFiles.forEach((file: { filename: string | number | boolean; id: any; description: any; }) => {
    const downloadButtonText: HTMLButtonElement = createButton("Download");
    const downloadButton: HTMLAnchorElement =  document.createElement('a');
    downloadButton.appendChild(downloadButtonText);
    downloadButton.href = `/download/${encodeURIComponent(file.filename)}?id=${file.id}`;

    const emailDownloadButton: HTMLButtonElement = createButton("Send to Email");
    const fileElement = document.createElement("div");
    fileElement.innerHTML = `
      <div id="file-${file.id}">
        <p>File Name: ${file.filename}</p>
        <p>Description: ${file.description}</p>
      </div>
    `;

    emailDownloadButton.addEventListener("click", async () => {
      try {
        // Prompt the user for their email address
        const userEmail = prompt("Enter your email address:");

        if (userEmail !== null) { // Check if the user entered an email address
          const emailResponse: Response = await fetch(`/emailDownload/${encodeURIComponent(file.filename)}?id=${file.id}`, {
            method: "POST", // Change the HTTP method to POST/
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail }), // Send the email in the request body
          });

          if (emailResponse.ok) {
            console.log("File sent to email successfully");
          } else {
            console.error("Error sending file to email:", emailResponse.statusText);
          }
        } else {
          console.log("User canceled the email prompt.");
        }
      } catch (error) {
        console.error("Error sending file:", error);
      }
    });

    // Append buttons and file element to the UI
    fileElement.appendChild(downloadButton);
    fileElement.appendChild(emailDownloadButton);
    fileListContainer.appendChild(fileElement);
  });
}


function createButton(text: string): HTMLButtonElement {
  const button: HTMLButtonElement = document.createElement("button");
  button.textContent = text;
  return button;
}

// Function to handle the search button click
async function searchFiles() {
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  const searchButton = document.getElementById('searchButton') as HTMLButtonElement;

  searchButton.addEventListener('click', async () => {
    const searchQuery = searchInput.value.trim();
    updateFileListAndDownloadFile(searchQuery); // Pass the search query to filter the file list
  });
}
searchFiles();
