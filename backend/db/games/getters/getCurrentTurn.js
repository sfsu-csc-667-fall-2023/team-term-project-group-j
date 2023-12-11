const database = require("../../connection");
const { connection: db } = database;

const GET_CURRENT_TURN = `
  SELECT "currentTurn_id" FROM rounds
  WHERE id=$1
`;

const getCurrentTurn = async (roundId) => {
  const result = await db.one(GET_CURRENT_TURN, [roundId]);
  return result;
};

module.exports = { getCurrentTurn };