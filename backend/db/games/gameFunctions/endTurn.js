const database = require("../../connection");
const { connection: db } = database;

const {checkFoldedPlayers} = require("../counters/checkFoldedPlayers.js");
const {getUserCount} = require("../getters/getUserCount.js");
const {endRound} = require("../gameFunctions/endRound.js");
const {checkRaiserLoop} = require("../checkers/checkRaiserLoop.js");
const {nextTurn} = require("../gameFunctions/nextTurn.js");
const {checkCC} = require("../checkers/checkCC.js");
const {revealNextCC} = require("../settersAdders/revealNextCC.js");

const endTurn = async (roomId, roundId) => {
    console.log("EndTurn");
    console.log(await checkFoldedPlayers(roomId));
    console.log(await getUserCount(roomId) - 1);

    //Check how many players have folded
    if(await checkFoldedPlayers(roomId) == await getUserCount(roomId) - 1){
        //If every player but 1 has folded, we can end the round
        await endRound(roomId, roundId);
    }

    //Not everyone has folded, proceed passing off the turn
    if(await checkRaiserLoop(roomId) == 0){
        //The next player is not the raiser. Pass off the turn
        await nextTurn(roomId, roundId);
    }
    else{
        //Next player is the raiser, determine if we need to end the round
        if(await checkCC(roundId) == 0){
            //Not all CC have been revealed, reveal the next one, then pass off the turn
            console.log("reveal next CC");
            await revealNextCC(roundId);
            await nextTurn(roomId, roundId);
        }
        else{
            //All CC's have been revealed, end the round
            console.log("EndRound");
            await endRound(roomId, roundId);
        }
    }
    
}

module.exports = { endTurn };