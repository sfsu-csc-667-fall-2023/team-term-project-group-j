const socket = io(); // Assuming Socket.IO is included in your HTML

function openChatWindow() {
  document.getElementById("chat-form-container").style.display = "block";
}

function closeChatWindow() {
  document.getElementById("chat-form-container").style.display = "none";
}

// You can now use 'socket' to emit and listen for events.
// For example, you can send a message to the server when the chat form is submitted:

const chatForm = document.querySelector(".form-container");
const chatInput = document.querySelector(".chat-box input");

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (message !== "") {
    // Emit a chat message event to the server
    socket.emit("chatMessage", { message });
    // Clear the input field
    chatInput.value = "";
  }
});

// You can also listen for incoming chat messages from the server
socket.on("incomingMessage", (data) => {
  // Handle incoming messages and update the chat UI
  console.log("Incoming message:", data.message);
});