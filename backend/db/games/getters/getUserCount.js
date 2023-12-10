const database = require("../../connection");
const { connection: db } = database;

const GET_PLAYER_COUNT = `
  SELECT players FROM room
  WHERE id=$1
`;

const getUserCount = async (roomId) => {
    try {
        const result = await db.oneOrNone(GET_PLAYER_COUNT, [roomId]);
        return result ? result.players.filter(playerId => playerId !== -1).length : 0;
    } catch (error) {
        console.error("Error getting user count:", error);
        return 0;
    }
};

module.exports = { getUserCount };