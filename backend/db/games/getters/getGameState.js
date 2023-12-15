const database = require("../../connection");
const { connection: db } = database;

const { getGame } = require("../getters/getGame.js");
const { getPot } = require("../getters/getPot.js");
const { getBlind } = require("../getters/getBlind.js");
const { getRoundCards } = require("../getters/getRoundCards.js");

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const GET_PLAYER = `
  SELECT * FROM players
  WHERE user_id=$1 AND room_id=$2
`;

const getGameState = async (gameId) => {
    const resultGame = await getGame(gameId);
    const roundId = resultGame.round_id;

    const resultPot = await getPot(roundId);
    const pot = resultPot.pot;

    const resultBlind = await getBlind(roundId);
    const blind = resultBlind.blind;

    const roundCards = await getRoundCards(gameId);

    const result = await db.oneOrNone(GET_PLAYERS, [gameId]);
    const playersString = String(result.players);
    const players = [];
    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        if(playerId != -1){
            const resultPlayer = await db.oneOrNone(GET_PLAYER, [playerId, gameId]);
            players.push(resultPlayer);
        }
    }

    const gameState = {
      pot: pot,
      blind: blind,
      deck: roundCards,
      players: players
    };
    return gameState;
  };

module.exports = { getGameState };