const database = require("../../connection");
const { connection: db } = database;

const UPDATE_PLAYER_MONEY = `
  UPDATE players
  SET bank = bank - $3
  WHERE user_id=$1 AND room_id=$2
  RETURNING bank
`;

const UPDATE_PLAYER_GAMBLED = `
    UPDATE players
    SET gambled = gambled + $3
    WHERE user_id=$1 AND room_id=$2
    RETURNING gambled
`;

const subPlayerMoney = async (userId, roomId, money) => {
    try {
        const result = await db.one(UPDATE_PLAYER_MONEY, [userId, roomId, money]);
        await db.one(UPDATE_PLAYER_GAMBLED, [userId, roomId, money]);
        return result.bank;
    } catch (error) {
        // Handle the error, e.g., log it or throw a custom error
        console.error("Error subtracting money to player's bank:", error);
        throw error;
    }
};

module.exports = { subPlayerMoney };