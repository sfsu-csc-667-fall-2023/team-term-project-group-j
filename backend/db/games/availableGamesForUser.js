const database = require("../connection");
const { connection: db } = database;

const QUERY = `
    SELECT players
    FROM room
    WHERE $1 = ANY(players);
`;

const availableGamesForUser = (userId) => {
    const result = db.manyOrNone(QUERY, [userId]);

    // Extract room_ids from the result
    const roomIds = result.map(row => row.room_id);

    return roomIds;
}


module.exports = { availableGamesForUser };