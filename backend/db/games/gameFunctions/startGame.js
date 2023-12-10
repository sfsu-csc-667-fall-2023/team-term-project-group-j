const database = require("../../connection");
const { connection: db } = database;

const { startRound } = require("../gameFunctions/startRound.js");
const { getGameHost } = require("../getters/getGameHost.js");

const ADD_ROUND = `
    UPDATE room
    SET round_id = $2
    WHERE id=$1
    RETURNING round_id
`;

const CREATE_ROUND = `
    INSERT INTO rounds (raiser_id, blind, pot, "currentTurn_id") 
    VALUES ($1, $2, $3, $4)
    RETURNING id
`;

const CREATE_FAKE_CARD =`
    INSERT INTO cards (rank, suite, user_id) 
    VALUES (0, 0, 0)
    RETURNING id
`;

const startGame = async (roomId) => {
    const hostId = await getGameHost(roomId);

    //Create a fake deck
    //await
    //const fakeDeck = new Array(15).fill();

    const result = await db.one(CREATE_ROUND, [-1, 5, 0, hostId]);
    const roundId = result.id;

    await db.one(ADD_ROUND, [roomId, roundId]);

    await startRound(roundId, roomId);
}

module.exports = { startGame };