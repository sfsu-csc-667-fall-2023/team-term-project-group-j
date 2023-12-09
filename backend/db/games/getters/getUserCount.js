const database = require("../../connection");
const { connection: db } = database;

const GET_PLAYER_COUNT = `
  SELECT players FROM room
  WHERE room_id=$1
`;

const getUserCount = async (roomId) => {
    const result = await db.oneOrNone('SELECT players FROM room WHERE room_id=$1', [roomId]);
    return result ? result.players.filter(playerId => playerId !== -1).length : 0;
};

module.exports = { getUserCount };