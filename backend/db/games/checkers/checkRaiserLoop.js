const database = require("../../connection");
const { connection: db } = database;

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE room_id=$1
`;

const checkRaiserLoop = (roundId) => db.one(GET_PLAYERS, [roundId]);
/*
const checkRaiserLoop = (gameId) => {
    const result = db.oneOrNone(GET_PLAYERS, [roundId]);

    for (const cardId of result.deck) {
        const cardResult = db.oneOrNone(GET_CARD_USER_ID, [cardId]);
        const userId = cardResult ? cardResult.user_id : null;

        if (userId === -4 || userId === -5) {
            // Unrevealed community card found
            return 0;
        }
    }

    // All cards have been revealed
    return 1;
};
*/


module.exports = { checkRaiserLoop };