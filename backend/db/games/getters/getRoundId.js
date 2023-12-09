const database = require("../../connection");
const { connection: db } = database;

const GET_ROUND_ID = `
  SELECT round_id FROM room
  WHERE id=$1
`;

const getRoundId = (gameId) => db.one(GET_ROUND_ID, [gameId]);

module.exports = { getRoundId };