const database = require("../../connection");
const { connection: db } = database;

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const isPlayerInGame = async (gameId, userId) => {
    const result = await db.oneOrNone(GET_PLAYERS, [gameId]);

    if (result && result.players && result.players.includes(userId)) {
        return 1;
    }

    return 0;
};

module.exports = { isPlayerInGame };