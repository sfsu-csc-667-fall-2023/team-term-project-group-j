const database = require("../../connection");
const { connection: db } = database;

const GET_GAME = `
  SELECT * FROM room
  WHERE room_id=$1
`;

const getGame = (roomId) => db.one(GET_GAME, [roomId]);

module.exports = { getGame };