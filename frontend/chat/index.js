import { io } from "socket.io-client";

const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

chatSocket.on("connect", () => {
    console.log("Socket connection established:", chatSocket.connected);
});


//When the chat socket recieves a message
chatSocket.on(`chat:message:0`, ({ from, timestamp, message, hash }) => {
    // const messageTemplate = document.querySelector("#chat-message").content.cloneNode(true)

    // console.log(messageTemplate);

    const div = document.createElement("div")
    div.classList.add("message");

    const p = document.createElement("p")
    p.innerText = from + ": " + message;

    div.appendChild(p);

    chatWindow.appendChild(div);
});

document.getElementById(`submit`).addEventListener(`click`, event => {
    console.log("Submit button clicked");
    event.preventDefault();
    submitMessage();
});

function submitMessage() {
    const message = document.getElementById("chat").value;
    console.log("Message submitted:", message);

    fetch(`/chat/0/chat`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });

    document.getElementById("chat").value = "";
}

