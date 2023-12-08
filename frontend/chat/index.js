import { io } from "socket.io-client";

//const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

chatSocket.on("chat:message:0", payload =>{
    console.log({payload})
})

document.getElementById('submit').addEventListener('click', event => {
    console.log("Hi there");
    submitMessage();
});

function submitMessage(){
    const message = document.getElementById("chat").value;
    console.log("Message submitted:", message);

    document.getElementById("chat").value = "";
}