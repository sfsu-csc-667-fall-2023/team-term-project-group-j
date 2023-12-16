const database = require("../../connection");
const { connection: db } = database;

const { getRoundId } = require("./getRoundId");
const { getCard } = require("./getCard");

const GET_DECK = `
  SELECT deck FROM rounds
  WHERE id=$1
`;

const getRoundCards = async (roomId) => {
    const roundId = (await getRoundId(roomId)).round_id;
    const result = await db.oneOrNone(GET_DECK, [roundId]);
    if(result == null){
        return 0;
    }

    const deck = result.deck;
    const hand = new Array(5);

    let card;
    let y = 0;
    for(let x = 0; x < deck.length; x++){
        card = await getCard(deck[x]);
        hand[y] = card;
        y++;
    }
    return hand;
};

module.exports = { getRoundCards };