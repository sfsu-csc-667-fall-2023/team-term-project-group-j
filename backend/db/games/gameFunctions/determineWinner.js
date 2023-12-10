const database = require("../../connection");
const { connection: db } = database;

const { getCard }= require("../getters/getCard.js");

const GET_DECK = `
    SELECT deck FROM rounds
    WHERE id=$1
`;

const GET_PLAYERS = `
    SELECT players FROM room
    WHERE id=$1
`;

const determineWinner = async (roomId, roundId) => {
    let winnerId = -1;
    let winnerScore = 0;
    const deck = await db.one(GET_DECK, [roundId]);

    const result = await db.oneOrNone(GET_PLAYERS, [roomId]);

    const playersString = String(result.players);
    const players = [];
    
    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
    }

    for(const playerId of players){
        if(playerId != -1 && await getPlayerFolded(playerId, roomId) == 0){
            //If the player has not folded, we can evaluate their score
            const holeCards = deck.filter((cardId) => getCard(cardId).user_id === playerId);
            const communityCards = deck.filter((cardId) => [-1, -2, -3, -6, -7].includes(getCard(cardId).user_id));

            // Combine hole cards and community cards to form the player's hand
            const playerHand = [...holeCards, ...communityCards];

            // Determine the rank of the player's hand
            const handScore = await getHandRank(playerHand);

            if (handScore > winnerScore) {
                winnerId = playerId;
                winnerScore = handScore;
            }
        }
    }

    return winnerId;
};

// Return a numeric value representing the strength of the hand.
const getHandRank = async (hand) => {
    let score = 0;

    hand.sort((a, b) => {
        if (a.rank === b.rank) {
            // If ranks are the same, compare suits
            return a.suite - b.suite;
        }
        // Otherwise, compare ranks
        return a.rank - b.rank;
    });

    //Royal flush

    //Straight flush

    //Four Of A Kind

    //Full House

    //Flush

    //Straight

    //Three Of A kind

    //Two pair

    //One pair

    //High Card
    
    //Assign a random score for now
    score = Math.floor(Math.random() * (1000 - 0 + 1)) + 0;

    return score;
};

const isFlush = (hand) => {
    const firstCardSuit = hand[0].suite;
    return hand.every((card) => card.suite === firstCardSuit);
};

const hasRank = (hand, targetRank) => hand.some(card => card.rank === targetRank);


module.exports = { determineWinner };