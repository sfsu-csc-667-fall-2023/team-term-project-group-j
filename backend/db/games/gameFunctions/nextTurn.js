const database = require("../../connection");
const { connection: db } = database;

const getPlayerMoney = require("../getters/getPlayerMoney.js");
const getPlayerFolded = require("../checkers/getPlayerFolded.js");
const getCurrentTurn = require("../getters/getCurrentTurn")
const setCurrentPlayer = require("../settersAdders/setCurrentPlayer.js");

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const nextTurn= (gameId) => {
    const players = db.oneOrNone(GET_PLAYERS, [gameId]);

    const currentPlayer = getCurrentTurn(gameId);

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
        const moneyStatus = getPlayerMoney(playerId, gameId);
        if (moneyStatus > 0 && getPlayerFolded(playerId, gameId) == 0) {
            setCurrentPlayer(playerId, roundId);
            return 1;
        }

    } while (timesIterated < 5);

    //error
    return 0;

};
module.exports = { nextTurn };