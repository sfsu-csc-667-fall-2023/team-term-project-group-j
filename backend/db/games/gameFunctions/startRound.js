const database = require("../../connection");
const { connection: db } = database;

const roundFoldPlayer = require("../settersAdders/roundFoldPlayer.js");
const getGame = require("../getters/getGame.js");
const getPlayerMoney = require("../getters/getPlayerMoney.js");
const setCurrentPlayer = require("../settersAdders/setCurrentPlayer.js");
const dealCard = require("../settersAdders/dealCard.js");

const UPDATE_ROUND = `
    UPDATE round
    SET raiser_id = -1,
        blind = 5,
        pot = 0,
    WHERE id=$1
    RETURNING id
`;

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const startRound = (roundId, roomId) => {

    roundFoldPlayer(roomId);

    //Determine first player in the order with money
    let currentTurn_id = -1;
    const players =  db.oneOrNone(GET_PLAYERS, [roomId]);

    for (const playerId of players) {
        if (playerId !== -1) {
            const moneyStatus = getPlayerMoney(playerId, gameId);
            if (moneyStatus > 0) {
                currentTurn_id = playerId;
                break;
            }
        }
    }

    if(currentTurn_id == -1){
        //could not start the round
        return 0;
    }

    //This will set the round's current player
    setCurrentPlayer[currentTurn_id, roundId];

    //This will reset the round's values
    db.one(UPDATE_ROUND, [roundId]);

    //This will set the round's deck
    dealCard(roomId);
    return 1;
}

module.exports = { startRound };