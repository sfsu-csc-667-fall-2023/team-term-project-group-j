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

const endGame = async (gameId, roundId) => {
    const result = await db.oneOrNone(GET_PLAYERS, [gameId]);

    const playersString = String(result.players);
    const players = [];
    
    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
    }

    //Delete players
    for (const playerId of players) {
        if (playerId !== -1) {
            await db.one(DELETE_PLAYER, [playerId, gameId]);
        }
    }

    //Delete Round
    await db.one(DELETE_ROUND, [roundId]);

    //Delete Room
    await db.one(DELETE_ROOM, [gameId]);

};

module.exports = { endGame };