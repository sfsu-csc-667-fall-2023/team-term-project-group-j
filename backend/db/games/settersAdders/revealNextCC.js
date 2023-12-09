const database = require("../../connection");
const { connection: db } = database;

const { getCard } = require("../getters/getCard");

const GET_DECK = `
    SELECT deck FROM rounds
    WHERE id=$1
`;

const REVEAL_CARD4 = `
    UPDATE cards
    SET user_id -6
    WHERE id = $1
    RETURNING id
`;

const REVEAL_CARD5 = `
    UPDATE cards
    SET user_id -7
    WHERE id = $1
    RETURNING id
`;

const revealNextCC = async (roundId) => {
    // Fetch the deck from the database
    const result = await db.one(GET_DECK, [roundId]);
    const deck = result.deck;

    let cCard4 = getCard(deck[3]);
    if(cCard4.user_id == -3){
        //Has not been revealed yet
        db.one(REVEAL_CARD4, [deck[3]]);
    }
    let cCard5 = getCard(deck[4]);
    if(cCard5.user_id == -4){
        //Has not been revealed yet
        db.one(REVEAL_CARD5, [deck[4]]);
    }
};


module.exports = { revealNextCC };