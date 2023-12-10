const database = require("../../connection");
const { connection: db } = database;

const GET_GAME = `
  SELECT id FROM room
  WHERE id=$1
`;

const doesGameExist = async (gameId) => {
    const result = await db.oneOrNone(GET_GAME, [gameId]);

    if (result && result.id) {
        return 1;
    }

    return 0;
};

module.exports = { doesGameExist };