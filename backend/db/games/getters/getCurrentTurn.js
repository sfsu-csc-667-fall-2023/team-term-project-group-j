const database = require("../../connection");
const { connection: db } = database;

const GET_CURRENT_TURN = `
  SELECT currentTurn_id FROM rounds
  WHERE id=$1
`;

const getCurrentTurn = (roundId) => db.one(GET_CURRENT_TURN, [roundId]);

module.exports = { getCurrentTurn };