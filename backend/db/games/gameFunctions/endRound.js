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

const DELETE_DECK = `
    UPDATE rounds
    SET deck = null
    WHERE id = $1
    RETURNING id
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
    await addPlayerMoney(winnerId, roomId, (await getPot(roundId)).pot);
    //Delete cards from db
    const resultDeck = await db.one(GET_DECK, [roundId]);
    const deckString = String(resultDeck.deck);
    const deckArray = [];
    
    // Manually populate the playersArray
    for (const cardId of deckString.split(',')) {
        const parsedCardId = parseInt(cardId, 10);
        deckArray.push(parsedCardId);
    }
    for (const cardId of deckArray) {
        await db.none(DELETE_CARD, [cardId]);
    }

    await db.one(DELETE_DECK, [roundId]);

    if((await playersWithMoneyCount(roomId)) == (await getUserCount(roomId)) - 1){
        //There is only 1 player left who had money. End the game
        console.log("endGame");
        await endGame(roomId, roundId);
    }
    else{
        console.log("StartNextRound");
        await startRound(roundId, roomId);
    }
    return 1;
}

module.exports = { endRound };
