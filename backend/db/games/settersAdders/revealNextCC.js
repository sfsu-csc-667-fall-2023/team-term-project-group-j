const database = require("../../connection");
const { connection: db } = database;

const { getCard } = require("../getters/getCard");

const GET_DECK = `
    SELECT deck FROM rounds
    WHERE id=$1
`;

const REVEAL_CARD4 = `
    UPDATE cards
    SET user_id = -6
    WHERE id = $1
    RETURNING id
`;

const REVEAL_CARD5 = `
    UPDATE cards
    SET user_id = -7
    WHERE id = $1
    RETURNING id
`;

const revealNextCC = async (roundId) => {
    // Fetch the deck from the database
    const result = await db.one(GET_DECK, [roundId]);
    const deckString = String(result.deck);
    const deckArray = [];
    
    // Manually populate the playersArray
    for (const cardId of deckString.split(',')) {
        const parsedCardId = parseInt(cardId, 10);
        deckArray.push(parsedCardId);
    }

    console.log(deckArray);

    let c4result = await getCard(deckArray[3]);
    let cCard4 = c4result.user_id;
    let cCard4id = c4result.id;
    let c5result = await getCard(deckArray[4]);
    let cCard5 = c5result.user_id;
    let cCard5id = c5result.id;

    if (cCard4 == -4) {
        // Has not been revealed yet
        await db.one(REVEAL_CARD4, [cCard4id]);
    }
    else if (cCard5 == -5) {
        // Has not been revealed yet
        await db.one(REVEAL_CARD5, [cCard5id]);
    }
};


module.exports = { revealNextCC };