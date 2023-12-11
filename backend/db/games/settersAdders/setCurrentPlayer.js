const database = require("../../connection");
const { connection: db } = database;

const SET_CURRENT_PLAYERS = `
    UPDATE rounds
    SET "currentTurn_id" = $1
    WHERE id = $2
    RETURNING id
`;

const setCurrentPlayer = async (userId, roundId) => await db.one(SET_CURRENT_PLAYERS, [userId, roundId]);

module.exports = { setCurrentPlayer };