const database = require("../../connection");
const { connection: db } = database;

const GET_DECK = `
  SELECT deck FROM rounds
  WHERE id=$1
`;

const GET_CARD_USER_ID = `
  SELECT user_id FROM cards
  WHERE id = $1
`;

const checkCC = async (roundId) => {
    const result = await db.oneOrNone(GET_DECK, [roundId]);

    if (!result || !result.deck || result.deck.length === 0) {
        // No deck or empty deck, community cards not revealed
        return 0;
    }

    for (const cardId of result.deck) {
        const cardResult = await db.oneOrNone(GET_CARD_USER_ID, [cardId]);
        const userId = cardResult ? cardResult.user_id : null;

        if (userId === -4 || userId === -5) {
            // Unrevealed community card found
            return 0;
        }
    }

    // All cards have been revealed
    return 1;
};


module.exports = { checkCC };