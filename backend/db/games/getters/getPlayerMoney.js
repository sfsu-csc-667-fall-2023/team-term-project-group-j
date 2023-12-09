const database = require("../../connection");
const { connection: db } = database;

const GET_PLAYER_MONEY = `
  SELECT bank FROM players
  WHERE user_id=$1
`;

const getPlayerMoney = (userId) => db.one(GET_PLAYER_MONEY, [userId]);

module.exports = { getPlayerMoney };