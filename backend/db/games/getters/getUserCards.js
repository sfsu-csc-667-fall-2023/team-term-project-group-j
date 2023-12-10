const database = require("../../connection");
const { connection: db } = database;

const { getRoundId } = require("../getters/getRoundId");
const { getCard } = require("../getters/getCard");

const GET_DECK = `
  SELECT deck FROM rounds
  WHERE id=$1
`;

const getUserCards = async (userId, roomId) => {
    console.log("Start getUserCards");
    const roundId = (await getRoundId(roomId)).round_id;
    const result = await db.one(GET_DECK, [roundId]);
    const deck = result.deck;

    const hand = new Array(2);

    if(deck == null){
        return 0;
    }

    let card;
    let y = 0;
    for(let x = 0; x < deck.length; x++){
        card = await getCard(deck[x]);
        if(card.user_id == userId){

            hand[y] = card;
            y++;
        }
    }
    return hand;
};

module.exports = { getUserCards };