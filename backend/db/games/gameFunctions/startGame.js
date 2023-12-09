const database = require("../../connection");
const { connection: db } = database;

const startRound = require("../gameFunctions/startRound.js");
const getGameHost = require("../getters/getGameHost.js");

const ADD_ROUND = `
    UPDATE room
    SET round_id = $2
    WHERE id=$1
    RETURNING round_id
`;

const CREATE_ROUND =`
    INSERT INTO rounds (raiser_id, blind, pot, currentTurn_id) 
    VALUES ($1, $2, $3)
    RETURNING id
`

const startGame = (roomId) => {
    const result = db.one(CREATE_ROUND, [-1, 5, 0, getGameHost(roomId)]);
    const roundId = result.id;

    db.one(ADD_ROUND, [roomId, roundId]);

    startRound(roundId, roomId);
}

module.exports = { startGame };