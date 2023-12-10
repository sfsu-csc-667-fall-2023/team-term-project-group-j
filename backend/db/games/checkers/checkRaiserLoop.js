const database = require("../../connection");
const { connection: db } = database;

const {getRaiser} = require("../getters/getRaiser");
const {getCurrentTurn} = require("../getters/getCurrentTurn");

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const checkRaiserLoop = async (gameId) => {
    const result = await db.oneOrNone(GET_PLAYERS, [gameId]);

    const playersString = String(result.players);
    const players = [];
    
    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
    }

    const currentPlayer = await getCurrentTurn(gameId);
    const raiserId = await getRaiser(gameId);

    // Find the index of the current player
    const currentPlayerIndex = players.indexOf(currentPlayer);

    // Determine the next player's index (circular order)
    let nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

    // Skip over empty spaces (-1) in the player array
    while (players[nextPlayerIndex] === -1) {
        nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
    }

    const nextPlayer = players[nextPlayerIndex];

    // Check if the next player is the raiser
    const isNextPlayerRaiser = nextPlayer === raiserId;

    return isNextPlayerRaiser ? 1 : 0;
};



module.exports = { checkRaiserLoop };