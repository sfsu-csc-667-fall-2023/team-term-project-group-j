const database = require("../../connection");
const { connection: db } = database;

const {getPlayerMoney} = require("../getters/getPlayerMoney.js");
const {getPlayerFolded} = require("../checkers/getPlayerFolded.js");
const {getCurrentTurn} = require("../getters/getCurrentTurn.js")
const {getRoundId} = require("../getters/getRoundId.js")
const {setCurrentPlayer} = require("../settersAdders/setCurrentPlayer.js");

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const nextTurn = async (gameId) => {
    const result = await db.oneOrNone(GET_PLAYERS, [gameId]);

    const playersString = String(result.players);
    const players = [];
    
    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
    }

    const resultCurrentPlayer = await getCurrentTurn(gameId);
    const currentPlayer = resultCurrentPlayer.currentTurn_id;

    // Find the index of the current player
    const currentPlayerIndex = players.indexOf(currentPlayer);

    let timesIterated = 0;

    // Determine the next player's index (circular order)
    let nextPlayerIndex = currentPlayerIndex;
    
    const roundIdObject = await getRoundId(gameId);
    const roundId = roundIdObject.round_id;

    do{
        // Skip over empty spaces (-1) in the player array
        nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
        const nextPlayer = players[nextPlayerIndex];

        //Make sure we are not looking at a null player
        if(nextPlayer != -1){
            //Check if they have money or if they have folded
            let resultMoney = await getPlayerMoney(nextPlayer, gameId);
            const foldedStatus = await getPlayerFolded(nextPlayer, gameId);
            const moneyStatus = resultMoney.bank;            

            if (moneyStatus > 0 && foldedStatus == 0) {
                console.log("Next Turn = ", nextPlayer);
                setCurrentPlayer(nextPlayer, roundId);
                return 1;
            }
        }
        
        timesIterated++;

    } while (timesIterated < 5);

    //error
    return 0;

};
module.exports = { nextTurn };