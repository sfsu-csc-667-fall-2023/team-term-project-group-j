const database = require("../../connection");
const { connection: db } = database;

const GET_ROUND_STATE = `
  SELECT * FROM rounds
  WHERE id=$1
`;

const getRoundState = (roundId) => db.one(GET_ROUND_STATE, [roundId]);

module.exports = { getRoundState };