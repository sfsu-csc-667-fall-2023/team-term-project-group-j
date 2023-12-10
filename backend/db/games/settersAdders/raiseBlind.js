const database = require("../../connection");
const { connection: db } = database;

const INCREASE_BLIND = `
  UPDATE rounds
  SET blind = blind + $2
  WHERE id=$1
  RETURNING blind
`;

const raiseBlind = async (roundId, money) => await db.one(INCREASE_BLIND, [roundId, money]);

module.exports = { raiseBlind };