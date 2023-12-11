const database = require("../../connection");
const { connection: db } = database;

const UPDATE_PLAYER_MONEY = `
  UPDATE players
  SET bank = bank + $3
  WHERE user_id=$1 AND room_id=$2
  RETURNING bank
`;

const addPlayerMoney = async (userId, roomId, money) => {
    console.log("AddPlayerMoney");
    try {
        const result = await db.one(UPDATE_PLAYER_MONEY, [userId, roomId, money]);
        return result.bank;
    } catch (error) {
        // Handle the error, e.g., log it or throw a custom error
        console.error("Error adding money to player's bank:", error);
        throw error;
    }
};

module.exports = { addPlayerMoney };