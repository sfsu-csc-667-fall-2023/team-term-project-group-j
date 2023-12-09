const database = require("../../connection");
const { connection: db } = database;

const GET_GAME_HOST = `
  SELECT host_id FROM room
  WHERE room_id=$1
`;

const getGameHost = (gameId) => db.one(GET_GAME_HOST, [gameId]);

module.exports = { getGameHost };