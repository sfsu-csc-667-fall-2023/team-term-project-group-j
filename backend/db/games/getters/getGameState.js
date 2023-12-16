const database = require("../../connection");
const { connection: db } = database;

const { getGame } = require("../getters/getGame.js");
const { getPot } = require("../getters/getPot.js");
const { getCurrentTurn } = require("../getters/getCurrentTurn.js");
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
    let pot = 0;
    if(resultPot != null){
      pot = resultPot.pot;
    }

    const resultBlind = await getBlind(roundId);
    let blind = 0;
    if(resultBlind != null){
      blind =resultBlind.blind;
    }

    const currentResult = await getCurrentTurn(roundId);
    let currentTurn = 0
    if(currentResult != null){
      currentTurn = currentResult.currentTurn_id;
    }

    let roundCards = await getRoundCards(gameId);

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
      currentTurn: currentTurn,
      deck: roundCards,
      players: players
    };
    return gameState;
  };

module.exports = { getGameState };