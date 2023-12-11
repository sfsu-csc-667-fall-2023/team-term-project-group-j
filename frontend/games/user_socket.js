import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

console.log("Hello from bundled user socket");

let userSocket;


const configure = (socketId) => {
  userSocket = io({ query: { id: socketId } });

  console.log("User socket configured");

  return Promise.resolve();
};

Object.keys(GAME_CONSTANTS).forEach((key) => {
  userSocket.on(GAME_CONSTANTS[key], (data) => {
    console.log({ event: GAME_CONSTANTS[key], data });

    // Check if the event is related to sending player cards
    if (GAME_CONSTANTS[key] === GAME_CONSTANTS.PLAYER_CARDS) {
      const { userId, cards } = data;

      // Emit the player's cards only to the respective user
      userSocket.emit(GAME_CONSTANTS.PLAYER_CARDS, { userId, cards });
    }
  });
});

// Update the UI to display the cards for the given user
function updatePlayerCards(userId, cards) {
    console.log(`Player ${userId} received cards:`, cards);
    // Update the UI as needed (e.g., render cards on the screen)
}
  
userSocket.on(GAME_CONSTANTS.PLAYER_CARDS, (data) => {
    const { userId, cards } = data;
    updatePlayerCards(userId, cards);
});

export { configure };
