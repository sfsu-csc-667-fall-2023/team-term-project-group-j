const database = require("../../connection");
const { connection: db } = database;

const GET_RAISER = `
  SELECT raiser_id FROM rounds
  WHERE round_id=$1
`;

const getRaiser = (roundId) => db.one(GET_RAISER, [roundId]);

module.exports = { getRaiser };