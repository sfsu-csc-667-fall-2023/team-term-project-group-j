const database = require("../../connection");
const { connection: db } = database;

const GET_PLAYER_COUNT = `
  SELECT players FROM room
  WHERE id=$1
`;

const getUserCount = (roomId) => {
    const result = db.oneOrNone(GET_PLAYER_COUNT, [roomId]);
    return result ? result.players.filter(playerId => playerId !== -1).length : 0;
};

module.exports = { getUserCount };