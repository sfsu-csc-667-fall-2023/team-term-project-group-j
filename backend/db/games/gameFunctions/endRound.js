const database = require("../../connection");
const { connection: db } = database;

const {checkFoldedPlayers} = require("../counters/checkFoldedPlayers.js");
const {getUserCount} = require("../getters/getUserCount.js");
const {getPlayerFolded} = require("../checkers/getPlayerFolded.js");
const {getPot} = require("../getters/getPot.js");
const {determineWinner} = require("./determineWinner.js");
const {addPlayerMoney} = require("../settersAdders/addPlayerMoney.js");
const {playersWithMoneyCount} = require("../counters/playersWithMoneyCount.js");
const {startRound} = require("../gameFunctions/startRound.js");

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

const endRound = async (roomId, roundId) => {
    let winnerId = -1;

    //Check if the player won through everyone else folding
    if(checkFoldedPlayers(roomId) == getUserCount(roomId) - 1){
        //Find the player who did not fold 
        const result = await db.oneOrNone(GET_PLAYERS, [roomId]);

        const playersString = String(result.players);
        const players = [];
        
        // Manually populate the playersArray
        for (const player of playersString.split(',')) {
            const playerId = parseInt(player, 10);
            players.push(playerId);
        }
        for(const playerId of players){
            if(getPlayerFolded(playerId, roomId) == 0){
                winnerId = playerId;
                break;
            }
        }
    }
    else{
        //Do the math to figure out who won
        winnerId = await determineWinner(roomId, roundId);
    }
    
    //Award winnder
    await addPlayerMoney(winnerId, roomId, getPot(roundId));

    //Delete cards from db
    const deck = await db.oneOrNone(GET_DECK, [roundId]);
    for(const cardId of deck){
        await db.one(DELETE_CARD, [cardId]);
    }

    if(await playersWithMoneyCount(roomId) == await getUserCount(roomId) - 1){
        //There is only 1 player left who had money. End the game
        await await endGame(roomId, roundId);
    }
    else{
        await await startRound(roundId, roomId);
    }
    return 1;
}

module.exports = { endRound };
