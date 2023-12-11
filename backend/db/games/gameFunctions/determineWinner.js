const database = require("../../connection");
const { connection: db } = database;

const { getCard }= require("../getters/getCard.js");
const { getPlayerFolded } = require("../checkers/getPlayerFolded.js");

const GET_DECK = `
    SELECT deck FROM rounds
    WHERE id=$1
`;

const GET_PLAYERS = `
    SELECT players FROM room
    WHERE id=$1
`;

const determineWinner = async (roomId, roundId) => {
    let winnerId = 1;
    let winnerScore = 0;
    const resultDeck = await db.one(GET_DECK, [roundId]);
    const deckString = String(resultDeck.deck);
    const deckArray = [];
    
    // Manually populate the playersArray
    for (const cardId of deckString.split(',')) {
        const parsedCardId = parseInt(cardId, 10);
        deckArray.push(parsedCardId);
    }
    const result = await db.oneOrNone(GET_PLAYERS, [roomId]);

    const playersString = String(result.players);
    const players = [];

    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
    }
    
    //Refuses to work for some reason 
    /*
    for (const playerId of players) {
        if (playerId !== -1) {
            console.log(deckArray);
            if (await getPlayerFolded(playerId, roomId) === 0) {
                // If the player has not folded, we can evaluate their score
                const holeCards = await Promise.all(
                    deckArray.map(async (cardId) => (await getCard(cardId)).user_id === playerId ? cardId : null)
                );
                const communityCards = await Promise.all(
                    deckArray.map(async (cardId) => [-1, -2, -3, -6, -7].includes((await getCard(cardId)).user_id) ? cardId : null)
                );
                // Remove null values from arrays
                const filteredHoleCards = holeCards.filter(Boolean);
                const filteredCommunityCards = communityCards.filter(Boolean);
    
                // Combine hole cards and community cards to form the player's hand
                const playerHand = [...filteredHoleCards, ...filteredCommunityCards];
    
                // Determine the rank of the player's hand
                const handScore = await getHandRank(playerHand);
    
                if (handScore > winnerScore) {
                    winnerId = playerId;
                    winnerScore = handScore;
                }
            }
        }
    }
    */
    console.log("Winner: " + winnerId);
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