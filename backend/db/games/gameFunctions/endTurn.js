const database = require("../../connection");
const { connection: db } = database;

const checkFoldedPlayers = require("../counters/checkFoldedPlayers.js");
const getUserCount = require("../getters/getUserCount.js");
const endRound = require("../gameFunctions/endRound.js");
const checkRaiserLoop = require("../checkers/checkRaiserLoop.js");
const nextTurn = require("../gameFunctions/nextTurn.js");
const checkCC = require("../checkers/checkCC.js");
const revealNextCC = require("../settersAdders/revealNextCC.js");

const endTurn = (roomId, roundId) => {

    //Check how many players have folded
    if(checkFoldedPlayers(roomId) == getUserCount(roomId) - 1){
        //If every player but 1 has folded, we can end the round
        endRound(roomId, roundId);
    }

    //Not everyone has folded, proceed passing off the turn
    if(checkRaiserLoop(roomId) == 0){
        //The next player is not the raiser. Pass off the turn
        nextTurn(roomId, roundId);
    }
    else{
        //Next player is the raiser, determine if we need to end the round
        if(checkCC(roundId) == 0){
            //Not all CC have been revealed, reveal the next one, then pass off the turn
            revealNextCC(roundId);
            nextTurn(roomId, roundId);
        }
        else{
            //All CC's have been revealed, end the round
            endRound(roomId, roundId);
        }
    }
    
}

module.exports = { endTurn };