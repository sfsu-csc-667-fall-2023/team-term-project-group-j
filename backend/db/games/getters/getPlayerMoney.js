const database = require("../../connection");
const { connection: db } = database;

const GET_PLAYER_MONEY = `
  SELECT bank FROM players
  WHERE user_id=$1 AND room_id=$2
`;

const getPlayerMoney = async (userId, roomId) => await db.one(GET_PLAYER_MONEY, [userId, roomId]);

module.exports = { getPlayerMoney };