const database = require("../../connection");
const { connection: db } = database;

const getPlayerMoney = require("../getters/getPlayerMoney.js");
const getRoundId = require("../getters/getRoundId.js")

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const UNFOLD_PLAYER = `
  UPDATE players
  SET folded = 0
  WHERE user_id=$1 AND room_id=$2
  RETURNING folded
`;


const roundFoldPlayer = (roomId) => {
    const players =  db.oneOrNone(GET_PLAYERS, [gameId]);

    if (players) {
        for (const playerId of players) {
            if (playerId !== -1) {
                const moneyStatus = getPlayerMoney(playerId, roomId);
                if (moneyStatus > 0) {
                    db.one(UNFOLD_PLAYER, [playerId, roomId]);
                }
            }
        }
        
    } else {
        // Handle the case where no players are found
        return 0;
    }

};

module.exports = { roundFoldPlayer };