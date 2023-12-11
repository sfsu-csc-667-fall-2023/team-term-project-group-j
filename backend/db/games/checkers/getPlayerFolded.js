const database = require("../../connection");
const { connection: db } = database;

const GET_PLAYER_FOLDED = `
  SELECT folded FROM players
  WHERE user_id=$1 AND room_id=$2
`;

const getPlayerFolded = async (userId, roomId) => {
  const result = await db.one(GET_PLAYER_FOLDED, [userId, roomId]);
  return result.folded;
}

module.exports = { getPlayerFolded };