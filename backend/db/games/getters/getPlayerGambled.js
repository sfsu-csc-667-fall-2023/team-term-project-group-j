const database = require("../../connection");
const { connection: db } = database;

const GET_PLAYER_GAMBLED = `
  SELECT gambled FROM players
  WHERE user_id=$1 AND room_id=$2
`;

const getPlayerGambled = async (userId, roomId) => await db.one(GET_PLAYER_GAMBLED, [userId, roomId]);

module.exports = { getPlayerGambled };