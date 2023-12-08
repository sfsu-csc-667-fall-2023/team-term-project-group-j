import { io } from "socket.io-client";

const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

chatSocket.on("chat:message:0", ({from, timestamp, message, hash }) => {
    const div = document.createElement("div")
    div.classList.add("message");

    const img =document.createElement("img");
    img.src = 'https://gravatar.com/avatar${hash}?s=30';
    img.alt = 'Avatar of ${from}'

    const p = document.createElement("p")
    p.innerText = message;

    div.appendChild(img);
    div.appendChild(p);

    chatWindow.appendChild(div);
});

/*
                <article id="chat-window">
                    <p class="text-me"><i>text me... </i></p>
                    <p class="text-me-not"><i>text me not.. </i></p>
                </article>
*/

document.getElementById('submit').addEventListener('click', event => {
    submitMessage();
});

function submitMessage(){
    const message = document.getElementById("chat").value;
    console.log("Message submitted:", message);
    
    fetch(`/chat/0`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        });

    document.getElementById("chat").value = "";
}