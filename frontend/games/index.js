const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;
const roomId = document.querySelector("#room-id").value;
const userId = document.querySelector("#user-id").value;

let raiseCount = 0; 

const raiseCountElement = document.getElementById("raiseField");

const handleStartAction = (event) => {
    event.preventDefault();
    console.log("Start button pressed");
    
    fetch(`/games/`+ roomId + `/start`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSocketId, gameSocketId, userId, roomId }),
        });
};

const handleCheckAction = (event) => {
    event.preventDefault();
    console.log("Check button pressed");
  
    fetch(`/games/`+ roomId + `/check`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSocketId, gameSocketId, userId, roomId }),
        });
};

const handleCallAction = (event) => {
    event.preventDefault();
    console.log("Call button pressed");
  
    fetch(`/games/`+ roomId + `/call`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSocketId, gameSocketId, userId, roomId }),
        });
};

const handleFoldAction = (event) => {
    event.preventDefault();
    console.log("fold button pressed");
  
    fetch(`/games/`+ roomId + `/fold`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSocketId, gameSocketId, userId, roomId }),
        });
};

const handleRaiseAction = (event) => {
    event.preventDefault();
    console.log("raise button pressed");
    raiseCount = parseInt(raiseCountElement.value, 10) || 0;
  
    fetch(`/games/`+ roomId + `/raise`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSocketId, gameSocketId, userId, roomId, raiseCount }),
        });
};

const addEventListenerIfElementExists = (elementId, eventListener) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener("submit", eventListener);
    } else {
        console.warn(`Element with ID '${elementId}' not found. Event listener not added.`);
    }
};

addEventListenerIfElementExists("startForm", handleStartAction);
addEventListenerIfElementExists("checkForm", handleCheckAction);
addEventListenerIfElementExists("callForm", handleCallAction);
addEventListenerIfElementExists("foldForm", handleFoldAction);
addEventListenerIfElementExists("raiseForm", handleRaiseAction);