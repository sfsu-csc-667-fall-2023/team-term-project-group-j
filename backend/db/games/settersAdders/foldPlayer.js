const database = require("../../connection");
const { connection: db } = database;

const FOLD_PLAYER = `
    UPDATE players
    SET folded = 1
    WHERE user_id=$1 AND room_id=$2
    RETURNING folded
`;

const foldPlayer = async (userId, roomId) => await db.one(FOLD_PLAYER, [userId, roomId]);

module.exports = { foldPlayer };