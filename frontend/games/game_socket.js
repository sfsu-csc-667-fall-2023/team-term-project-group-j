import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

let gameSocket;

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId } });

  gameSocket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

  console.log("Game socket configured");

  return Promise.resolve();
};

const stateUpdated = ({ blind, pot, communityCards, players }) => {
    // Callback function called when the game state is updated
    console.log({ blind, pot, communityCards, players });
  
    // Update the displayed blind and pot in the UI
    updateBlindAndPot(blind, pot);
  
    if(communityCards !== -1){
        // Update the community cards in the UI
        updateCommunityCards(communityCards);
    }

    for(let x = 0; x < 5; x++){
        const { email, bank, status} = players[x];
        if(x == 0){
            updatePlayerInfo(playerOne, email, bank, status)
        }else if(x == 1){
            updatePlayerInfo(playerTwo, email, bank, status)
        }else if(x == 2){
            updatePlayerInfo(playerThree, email, bank, status)
        }else if(x == 3){
            updatePlayerInfo(playerFour, email, bank, status)
        }else if(x == 4){
            updatePlayerInfo(playerFive, email, bank, status)
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
        //Check

    }else{
        //Call

    }

};

const ccOne = document.getElementById(".comm-card-one");
const ccTwo = document.getElementById(".comm-card-two");
const ccThree = document.getElementById(".comm-card-three");
const ccFour = document.getElementById(".comm-card-four");
const ccFive = document.getElementById(".comm-card-five");

// Update the displayed community cards in the UI
const updateCommunityCards = (communityCards) => {
    console.log("Community Cards: " + communityCards);
};

const playerOne = document.getElementById(".player-one");
const playerTwo = document.getElementById(".player-two");
const playerThree = document.getElementById(".player-three");
const playerFour = document.getElementById(".player-four");
const playerFive = document.getElementById(".player-five");

// Update the displayed information for each player in the UI
const updatePlayerInfo = (container, email, bank, status) => {
    if(email !== -1){
        container.innerHTML = email + ": $" + bank;

         // Change background color based on status
         if (status === 2) {
            container.style.backgroundColor = "green";
        } else if (status === 1) {
            container.style.backgroundColor = "red";
        } else if (status === 0) {
            container.style.backgroundColor = "black";
        }
    }else{
        container.innerHTML = "";
        container.style.backgroundColor = "";
    }

};

export { configure };