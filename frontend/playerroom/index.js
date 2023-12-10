import { io } from "socket.io-client";

const gameEntryTemplate = document.querySelector("#join-game-entry");
const gameList = document.querySelector("#game-list ul");


document.getElementById(`joinGameButton`).addEventListener(`click`, event => {
    console.log("join button clicked");
    event.preventDefault();
    joinGame();
});


function joinGame() {
    console.log("Inside joinGame()");

    // Get the value entered by the user
    var gameId = document.getElementById("joinGameInput").value;

    // Set the form action dynamically
    document.getElementById("joinGameForm").action = "/games/" + gameId + "/join";

    // Submit the form
    document.getElementById("joinGameForm").submit();
}