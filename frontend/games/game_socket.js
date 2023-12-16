import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

let gameSocket;
let userId;

const configure = (socketId, user) => {
  gameSocket = io({ query: { id: socketId } });
  console.log("Game socket configured");

  userId = user;

  gameSocket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

  return Promise.resolve();
};

let playerOne = document.getElementById("player-one");
let playerTwo = document.getElementById("player-two");
let playerThree = document.getElementById("player-three");
let playerFour = document.getElementById("player-four");
let playerFive = document.getElementById("player-five");

//html emlments for pot  and blind 


const stateUpdated = ({ blind, pot, currentTurn, deck, players }) => {
    // Callback function called when the game state is updated
    console.log("Game state updated");
    console.log({ blind, pot, currentTurn, deck, players});
  
    // Update the displayed blind and pot in the UI
    updateBlindAndPot(blind, pot);
  
    if(deck !== 0){
        // Update the community cards in the UI
        updateCards(deck);
    }

    if (Array.isArray(players)) {
        for(let x = 0; x < 5; x++){
            let user_id = -1;
            let username = 0;
            let bank = 0;
            let folded = 0;
            updatePlayerInfo(players, currentTurn);
            if(x < players.length){
                ({ user_id, username, bank, folded } = players[x]);
            }
            
            let isTurn = 0;

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

let potElement = document.getElementById("pot");
let blindElement = document.getElementById("blind-btn");

let checkElement = document.getElementById("checkForm");
let callElement = document.getElementById("callForm");
  
const updateBlindAndPot = (blind, pot) => {
    console.log("Update Blind and Pot");
    potElement.innerHTML = "POT: $" + pot;
    blindElement.innerHTML = "BLIND: $" + blind;

    //Remove Check or Call button depending on the pot
    if (pot < 1) {
        // Show the check button and hide the call button
        checkElement.style.display = "inline-block";
        callElement.style.display = "none";
    } else {
        // Hide the check button and show the call button
        checkElement.style.display = "none";
        callElement.style.display = "inline-block";
    }
};

let ccOne = document.getElementById("comm-card-one");
let ccTwo = document.getElementById("comm-card-two");
let ccThree = document.getElementById("comm-card-three");
let ccFour = document.getElementById("comm-card-four");
let ccFive = document.getElementById("comm-card-five");

let holeOne = document.getElementById("chose-card-one");
let holeTwo = document.getElementById("chose-card-two");

// Update the displayed cards in the UI
const updateCards = (deck) => {
    console.log("Deck", deck.map(card => ({ rank: convertRank(card.rank), suite: card.suite, user_id: card.user_id })));

    //Since ACE is the highest rank, ACE's rank is 13. This makes the king a 12, the queen an 11
    //the jack a 10, the 10 a 9... the 2 a 1
    
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

const convertRank = (rank) => {
//since ace is the highest rank is 13
//king 12 queen 11 and  so on 

    if (rank === 1) {
        return 2;
    } else {
        return 15 - rank; 
    }
};
// Update the displayed information for each player in the UI
const updatePlayerInfo = (container, username, bank, folded, currentTurn) => {
    if(username != 0){
        container.innerHTML = username + ": $" + bank;

         // Change background color based on status
        if (folded == 1) {
            container.style.backgroundColor = "red";
        } 
        else if (currentTurn == 1) {
            container.style.backgroundColor = "green";
        }
        else if (folded == 0) {
            container.style.backgroundColor = "black";
        }
    }else{
        container.innerHTML = "";
        container.style.backgroundColor = "";
    }

};

export { configure };