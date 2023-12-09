const database = require("../../connection");
const { connection: db } = database;

const GET_POT = `
  SELECT pot FROM rounds
  WHERE round_id=$1
`;

const getPot = (roundId) => db.one(GET_POT, [roundId]);

module.exports = { getPot };