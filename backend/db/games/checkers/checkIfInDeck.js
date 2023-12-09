const database = require("../../connection");
const { connection: db } = database;

const { getCard } = require("../getters/getCard");

const GET_DECK = `
  SELECT deck FROM rounds
  WHERE id=$1
`;

const checkIfInDeck = async (roundId, rank, suite) => {
    try {
        // Fetch the deck from the database
        const result = await db.one(GET_DECK, [roundId]);
        const deck = result.deck;

        // Check if any card in the deck has the same rank and suite
        const cardExists = await Promise.all(
            deck.map(async (cardId) => {
                // Fetch the card from the database based on its ID
                const card = await getCard(cardId);
                return card.rank === rank && card.suite === suite;
            })
        );

        // Return 1 if at least one card with the same rank and suite is found
        return cardExists.some((exists) => exists) ? 1 : 0;
    } catch (error) {
        console.error("Error checking if card is in deck:", error);
        throw error;
    }
};


module.exports = { checkIfInDeck };