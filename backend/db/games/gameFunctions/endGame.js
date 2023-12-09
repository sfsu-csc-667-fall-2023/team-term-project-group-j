const database = require("../../connection");
const { connection: db } = database;

const DELETE_PLAYER = `
    DELETE FROM players
    WHERE user_id=$1 AND room_id=$2
`;

const DELETE_ROUND = `
    DELETE FROM rounds
    WHERE id=$1
`;

const DELETE_ROOM = `
    DELETE FROM room
    WHERE id=$1
`;

const endGame = (gameId, roundId) => {
    const players =  db.oneOrNone(GET_PLAYERS, [gameId]);

    //Delete players
    for (const playerId of players) {
        if (playerId !== -1) {
            db.one(DELETE_PLAYER, [playerId, gameId]);
        }
    }

    //Delete Round
    db.one(DELETE_ROUND, [roundId]);

    //Delete Room
    db.one(DELETE_ROOM, [gameId]);

};

module.exports = { endGame };