const ticketBox = document.getElementById("ticket-box");
const screenshotContainer = document.getElementById("screenshot-container");
let screenshotData = null;

// Toggle the ticket box visibility
function toggleTicketBox() {
  const isOpen = ticketBox.classList.contains("open");

  if (isOpen) {
    ticketBox.classList.remove("open");
    screenshotContainer.innerHTML = ""; // Clear screenshot when closing
    screenshotData = null;
  } else {
    ticketBox.classList.add("open");
    captureScreenshot();
  }
}

// Capture a screenshot of the page, excluding the ticket box
async function captureScreenshot() {
  if (typeof html2canvas === "undefined") {
    alert("html2canvas is not loaded. Ensure the library is included in your HTML.");
    return;
  }

  // Temporarily hide the ticket box
  ticketBox.style.visibility = "hidden";
  const ticketButton = document.querySelector(".ticket-button");
  ticketButton.style.visibility = "hidden";

  const canvas = await html2canvas(document.body, {
    ignoreElements: (element) => element.id === "ticket-box" || element.classList.contains("ticket-button"),
  });

  screenshotData = canvas.toDataURL("image/png");

  // Restore the ticket box visibility
  ticketBox.style.visibility = "visible";
  ticketButton.style.visibility="visible";

  const img = document.createElement("img");
  img.src = screenshotData;
  img.className = "screenshot";
  img.alt = "Screenshot";
  img.onclick = () => openScreenshotModal(screenshotData);

  screenshotContainer.innerHTML = "";
  screenshotContainer.appendChild(img);
}

// Open the screenshot in a larger modal
function openScreenshotModal(dataUrl) {
  const modal = document.createElement("div");
  modal.className = "screenshot-modal";

  const img = document.createElement("img");
  img.src = dataUrl;
  img.className = "screenshot-large";
  img.alt = "Full Screenshot";

  const closeButton = document.createElement("button");
  closeButton.className = "close-modal";
  closeButton.innerText = "×";
  closeButton.onclick = () => document.body.removeChild(modal);

  modal.appendChild(img);
  modal.appendChild(closeButton);
  document.body.appendChild(modal);
}




// Submit the ticket
document.getElementById("ticket-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const priority = document.getElementById("priority").value;
  const description = document.getElementById("description").value;

  if (!description.trim()) {
    alert("Please provide a description for your ticket.");
    return;
  }

  const ticketDetails = {
    username: "admin",
    description,
    priority,
    screenshot: screenshotData,
    app_client_id: "your_app_client_id_here",
  };

  try {
    const response = await fetch("http://localhost:3010/api/tickets/createFmsTicket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketDetails),
    });

    if (response.ok) {
      alert("Your ticket has been raised successfully!");
      toggleTicketBox(); // Close the ticket box
    } else {
      alert("Failed to raise the ticket. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while raising the ticket.");
  }
});
