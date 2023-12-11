const database = require("../../connection");
const { connection: db } = database;

const {getPlayerMoney} = require("../getters/getPlayerMoney.js");
const {getPlayerFolded} = require("../checkers/getPlayerFolded.js");
const {getCurrentTurn} = require("../getters/getCurrentTurn")
const {setCurrentPlayer} = require("../settersAdders/setCurrentPlayer.js");

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const nextTurn = async (gameId) => {
    console.log("Start next turn");
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
    let nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    

    do{
        // Skip over empty spaces (-1) in the player array
        while (players[nextPlayerIndex] === -1) {
            nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
        }
        const nextPlayer = players[nextPlayerIndex];

        //Check if they have money or if they have folded
        const moneyStatus = await getPlayerMoney(nextPlayer, gameId);
        if (moneyStatus > 0 && await getPlayerFolded(nextPlayer, gameId) == 0) {
            setCurrentPlayer(nextPlayer, roundId);
            return 1;
        }

    } while (timesIterated < 5);

    //error
    return 0;

};
module.exports = { nextTurn };