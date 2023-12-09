const database = require("../../connection");
const { connection: db } = database;

const checkFoldedPlayers = require("../counters/checkFoldedPlayers.js");
const getUserCount = require("../getters/getUserCount.js");
const getPlayerFolded = require("../checkers/getPlayerFolded.js");
const getPot = require("../getters/getPot.js");
const determineWinner = require("./determineWinner.js");
const addPlayerMoney = require("../settersAdders/addPlayerMoney.js");
const playersWithMoneyCount = require("../counters/playersWithMoneyCount.js");
const startRound = require("../gameFunctions/startRound.js");

const GET_PLAYERS = `
    SELECT players FROM room
    WHERE id=$1
`;

const GET_DECK = `
    SELECT deck FROM rounds
    WHERE id=$1
`;

const DELETE_CARD = `
    DELETE FROM cards
    WHERE id=$1
`;

const endRound = (roomId, roundId) => {
    let winnerId = -1;

    //Check if the player won through everyone else folding
    if(checkFoldedPlayers(roomId) == getUserCount(roomId) - 1){
        //Find the player who did not fold 
        const players =  db.oneOrNone(GET_PLAYERS, [roomId]);
        for(const playerId of players){
            if(getPlayerFolded(playerId, roomId) == 0){
                winnerId = playerId;
                break;
            }
        }
    }
    else{
        //Do the math to figure out who won
        winnerId = determineWinner(roomId, roundId);
    }
    
    //Award winnder
    addPlayerMoney(winnerId, roomId, getPot(roundId));

    //Delete cards from db
    const deck =  db.oneOrNone(GET_DECK, [roundId]);
    for(const cardId of deck){
        db.one(DELETE_CARD, [cardId]);
    }

    if(playersWithMoneyCount(roomId) == getUserCount(roomId) - 1){
        //There is only 1 player left who had money. End the game
        endGame(roomId, roundId);
    }
    else{
        startRound(roundId, roomId);
    }
    return 1;
}

module.exports = { endRound };
