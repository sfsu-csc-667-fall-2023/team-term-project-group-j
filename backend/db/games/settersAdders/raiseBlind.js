const database = require("../../connection");
const { connection: db } = database;

const INCREASE_BLIND = `
  UPDATE rounds
  SET blind = $2
  WHERE id=$1
  RETURNING id
`;

const SET_RAISER = `
  UPDATE rounds
  SET raiser_id = $1
  WHERE id=$2
  RETURNING id
`;

const raiseBlind = async (roundId, userId, money) => {
    await db.one(INCREASE_BLIND, [roundId, money]);
    await db.one(SET_RAISER, [userId, roundId]);
}

module.exports = { raiseBlind };