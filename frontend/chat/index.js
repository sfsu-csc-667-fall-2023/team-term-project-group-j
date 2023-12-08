import { io } from "socket.io-client";

const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

chatSocket.on("chat:message:0", payload =>{
    console.log({payload});



})

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