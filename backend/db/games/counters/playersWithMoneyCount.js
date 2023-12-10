const database = require("../../connection");
const { connection: db } = database;

const {getPlayerMoney} = require("../getters/getPlayerMoney.js");

const GET_PLAYERS = `
    SELECT players FROM room
    WHERE id=$1
`;

const playersWithMoneyCount = async (gameId) => {
    const result = await db.oneOrNone(GET_PLAYERS, [gameId]);

    const playersString = String(result.players);
    const players = [];
    
    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
    }

    if (players) {
        let moneyCount = 0;

        for (const playerId of players) {
            if (playerId !== -1) {
                const moneyStatus = await getPlayerMoney(playerId, gameId);
                if (moneyStatus.bank > 1) {
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