import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

console.log("Hello from bundled game socket");
const userId = document.querySelector("#user-id").value;

let gameSocket;

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId } });
  console.log("Game socket configured");

  return Promise.resolve();
};
const checkSocketConnection = () => {
    // Check if the socket is connected
    if (gameSocket && gameSocket.connected) {
      console.log('Socket is connected to the server.');
    } else {
      console.log('Socket is not connected to the server.');
    }
  };

gameSocket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

const stateUpdated = ({ blind, pot, currentTurn, deck, players }) => {
    // Callback function called when the game state is updated
    console.log("Game state updated");
    console.log({ blind, pot, currentTurn, deck, players});
  
    // Update the displayed blind and pot in the UI
    updateBlindAndPot(blind, pot);

    updateCurrentTurn(currentTurn);
  
    if(communityCards !== 0){
        // Update the community cards in the UI
        updateCards(deck);
    }

    if (Array.isArray(players)) {
        for(let x = 0; x < players.length; x++){
            const {user_id, username, bank, folded} = players[x];
            
            const isTurn = 0;
            if(user_id == currentTurn){
                isTurn = 1;
            }

            if(x == 0){
                updatePlayerInfo(playerOne, username, bank, folded, isTurn)
            } else if(x == 1){
                updatePlayerInfo(playerTwo, username, bank, folded, isTurn)
            } else if(x == 2){
                updatePlayerInfo(playerThree, username, bank, folded, isTurn)
            } else if(x == 3){
                updatePlayerInfo(playerFour, username, bank, folded, isTurn)
            } else if(x == 4){
                updatePlayerInfo(playerFive, username, bank, folded, isTurn)
            }
        }
    }
};

const potElement = document.getElementById(".pot");
const blindElement = document.getElementById(".blind-btn");

const checkElement = document.getElementById(".pot");
const callElement = document.getElementById(".blind-btn");
  
const updateBlindAndPot = (blind, pot) => {
    potElement.innerHTML = "POT: $" + pot;
    blindElement.innerHTML = "BLIND: $" + blind;

    //Remove Check or Call button depending on the pot
    if(pot < 1){
        //Remove the call button, add check

    }else{
        //Remove the check button, add call

    }
};

const ccOne = document.getElementById(".comm-card-one");
const ccTwo = document.getElementById(".comm-card-two");
const ccThree = document.getElementById(".comm-card-three");
const ccFour = document.getElementById(".comm-card-four");
const ccFive = document.getElementById(".comm-card-five");

// Update the displayed cards in the UI
const updateCards = (deck) => {
    console.log("Deck " + deck);
    
    for(let x = 0; x < deck.length; x++){
        //Display the community cards
        if(deck[x].user_id < 0){
            //If the user_id is -4 or -5, then they should not be revealed yet
            if(deck[x].user_id == -4){

            }
            else if (deck[x].user_id == -5){

            }

        }
        else if(deck[x].user_id == userId){
            //Display the player's cards
        }
    }
};

const playerOne = document.getElementById(".player-one");
const playerTwo = document.getElementById(".player-two");
const playerThree = document.getElementById(".player-three");
const playerFour = document.getElementById(".player-four");
const playerFive = document.getElementById(".player-five");

// Update the displayed information for each player in the UI
const updatePlayerInfo = (container, username, bank, folded, currentTurn) => {
    if(username !== -1){
        container.innerHTML = username + ": $" + bank;

         // Change background color based on status
        if (folded === 1) {
            container.style.backgroundColor = "red";
        } 
        else if (currentTurn === 1) {
            container.style.backgroundColor = "black";
        }
        else if (folded === 0) {
            container.style.backgroundColor = "black";
        }
    }else{
        container.innerHTML = "";
        container.style.backgroundColor = "";
    }

};

export { configure };