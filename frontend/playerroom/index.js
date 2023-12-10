import { io } from "socket.io-client";

const gameEntryTemplate = document.querySelector("#join-game-entry");
const gameList = document.querySelector("#game-list ul");

console.log("Hello From index.js");

document.getElementById(`joinGameButton`).addEventListener(`click`, event => {
    event.preventDefault();
    joinGame();
});

async function joinGame() {
    var gameId = document.getElementById("joinGameInput").value;
    console.log("Joining Game:", gameId);

    try {
        const response = await fetch(`/games/${gameId}/join`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId }),
        });

        // Check if the response status is in the 2xx range (success)
        if (response.ok) {
            // Redirect to the desired location
            window.location.href = `/games/${gameId}`;
        } else {
            console.error('Failed to join the game. Server returned:', response.status);
        }
    } catch (error) {
        console.error('Error while joining the game:', error);
    }

    document.getElementById("chat").value = "";
}