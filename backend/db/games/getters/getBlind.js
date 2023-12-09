const database = require("../../connection");
const { connection: db } = database;

const GET_BLIND = `
  SELECT blind FROM rounds
  WHERE id=$1
`;

const getBlind = (roundId) => db.one(GET_BLIND, [roundId]);

module.exports = { getBlind };