const database = require("../../connection");
const { connection: db } = database;

const SET_CURRENT_PLAYERS = `
    UPDATE round
    SET currentTurn_id = $1
    WHERE id = $2
    RETURNING currentTurn_id
`;

const setCurrentPlayer = (userId, roundId) => db.one(SET_CURRENT_PLAYERS, [userId, roundId]);

module.exports = { setCurrentPlayer };