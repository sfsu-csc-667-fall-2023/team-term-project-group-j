const database = require("../../connection");
const { connection: db } = database;

const getPlayerMoney = require("../getters/getPlayerMoney.js");

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const playersWithMoneyCount = (gameId) => {
    const players =  db.oneOrNone(GET_PLAYERS, [gameId]);

    if (players) {
        let moneyCount = 0;

        for (const playerId of players) {
            if (playerId !== -1) {
                const moneyStatus = getPlayerMoney(playerId, gameId);
                if (moneyStatus < 1) {
                    moneyCount++;
                }
            }
        }

        return moneyCount;
    } else {
        // Handle the case where no players are found
        return 0;
    }
};
module.exports = { playersWithMoneyCount };