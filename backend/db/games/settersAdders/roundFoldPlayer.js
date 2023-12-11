const database = require("../../connection");
const { connection: db } = database;

const {getPlayerMoney} = require("../getters/getPlayerMoney.js");
const {foldPlayer}= require("../settersAdders/foldPlayer.js")

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


const roundFoldPlayer = async (roomId) => {
    const result = await db.oneOrNone(GET_PLAYERS, [roomId]);

    const playersString = String(result.players);
    const players = [];
    
    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
    }

    if (players) {

        for (const playerId of players) {
            if (playerId !== -1) {
                const result = await getPlayerMoney(playerId, roomId);
                const moneyStatus = result.bank;
                if (moneyStatus > 0) {
                    await db.one(UNFOLD_PLAYER, [playerId, roomId]);
                }
                else{
                    //if they don't have money, they should be auto-folded
                    await foldPlayer(playerId, roomId);
                }
            }
        }
        return 1;
        
    } else {
        // Handle the case where no players are found
        return 0;
    }

};

module.exports = { roundFoldPlayer };