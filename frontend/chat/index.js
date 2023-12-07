import { io } from "socket.io-client";

//const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

chatSocket.on("chat:message:0", payload =>{
    console.log({payload})
})