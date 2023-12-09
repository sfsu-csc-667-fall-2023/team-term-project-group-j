const database = require("../../connection");
const { connection: db } = database;

const GET_RAISER = `
  SELECT raiser_id FROM rounds
  WHERE id=$1
`;

const getRaiser = (roundId) => db.one(GET_RAISER, [roundId]);

module.exports = { getRaiser };