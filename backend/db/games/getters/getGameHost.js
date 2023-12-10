const database = require("../../connection");
const { connection: db } = database;

const GET_GAME_HOST = `
  SELECT host_id FROM room
  WHERE id=$1
`;

const getGameHost = async (gameId) => {
  try {
    const result = await db.one(GET_GAME_HOST, [gameId]);
    return result.host_id;
  } catch (error) {
    console.error('Error getting game host:', error);
    throw error;
  }
};

module.exports = { getGameHost };