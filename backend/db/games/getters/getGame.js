const database = require("../../connection");
const { connection: db } = database;

const GET_GAME = `
  SELECT * FROM room
  WHERE id=$1
`;

const getGame = async (roomId) => db.one(GET_GAME, [roomId]);

module.exports = { getGame };