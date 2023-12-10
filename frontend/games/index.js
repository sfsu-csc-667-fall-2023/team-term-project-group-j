const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;
const roomId = document.querySelector("#room-id").value;
const userId = document.querySelector("#user-id").value;

const raiseCount = document.getElementById("raiseField");

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
  
    fetch(`/games/`+ roomId + `/raise`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSocketId, gameSocketId, userId, roomId }),
        });
};

document.getElementById("#start-form").addEventListener("click", handleStartAction);
document.getElementById("#check-form").addEventListener("click", handleCheckAction);
document.getElementById("#call-form").addEventListener("click", handleCallAction);
document.getElementById("#fold-form").addEventListener("click", handleFoldAction);
document.getElementById("#raise-form").addEventListener("click", handleRaiseAction);

//<link rel="stylesheet" type="text/css" media="screen" href="css/login.css">
//</link><link rel="stylesheet" type="text/css" media="screen" href="css/gamelobby.css">
