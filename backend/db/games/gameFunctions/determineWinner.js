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
    let winnerId;
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

//console.log("COMM CARD=");
    //Get the community cards
    let communityCards = [];
    for(const cardId of deckArray){
        const card = await getCard(cardId);
        if(card.user_id < 0){
//console.log(card);
            communityCards.push(card);
        }
    }
    
    for (const playerId of players) {
        if (playerId !== -1) {
            if (await getPlayerFolded(playerId, roomId) === 0) {
                // If the player has not folded, we can evaluate their score
                let x = 0;
                let holeCards = [];
                let playerHand = [];
//console.log("Player " + playerId+ " cards=")
                for(const cardId of deckArray){
                    const card = await getCard(cardId);
                    if(playerId == card.user_id){
//console.log(card);
                        holeCards.push(card);
                        playerHand.push(card);
                        x++;
                    }
                    //Leave the loop early if both hold cards are found
                    if(x == 2){
                        break;
                    }
                }

                //put the comm cards into the playerHand
                for(let y = 0; y < 5; y++){
                    let commCard = communityCards[y]
                    playerHand.push(commCard);
                }
    
                // Determine the rank of the player's hand
                let handScore = await getHandRank(playerHand);

                //Add the user's highest card
                if(holeCards[0].rank > holeCards[1].rank){
                    handScore += (holeCards[0].rank * 4);
                    handScore += holeCards[0].suite;
                }
                else if(holeCards[0].rank < holeCards[1].rank){
                    handScore += (holeCards[1].rank * 4);
                    handScore += holeCards[1].suite;
                }
                else if(holeCards[0].rank == holeCards[1].rank){
                    handScore += (holeCards[0].rank * 4);
                    if(holeCards[0].suite > holeCards[1].suite){
                        handScore += holeCards[0].suite;
                    }
                    else{
                        handScore += holeCards[1].suite;
                    }
                }
                console.log("Player " + playerId + " score: " + handScore);

                if (handScore > winnerScore) {
                    winnerId = playerId;
                    winnerScore = handScore;
                }
            }
        }
    }

    console.log("Winner: " + winnerId);
    return winnerId;
};

//Suites lowest -> highest
//Club - Diamond - Heart - Spade

// Return a numeric value representing the strength of the hand.
const getHandRank = async (hand) => {
    let score = 0;

    hand.sort((a, b) => {
        if (a.rank === b.rank) {
            // If ranks are the same, compare suits
            return b.suite - a.suite; // Compare suites in descending order
        }
        // Otherwise, compare ranks in descending order
        return b.rank - a.rank;
    });
    
    console.log(hand);

    score = await royalFlush(hand);
    if(score == 0){
        score = await straightFlush(hand);
        if(score == 0){
            score = await fourOfKind(hand);
            if(score == 0){
                score = await fullHouse(hand);
                if(score == 0){
                    score = await flush(hand);
                    if(score == 0){
                        score = await straight(hand);
                        if(score == 0){
                            score = await oneTrio(hand);
                            if(score == 0){
                                score = await onePair(hand);
                            }
                        }
                    }
                }
            }
        }
    }
    if(score == 0){
        console.log("Score is highest card");
    }

    return score;
};

//Return 1 if the hand has a straight, return 0 if not
const hasStraight = async (hand) =>{
    //This loop will check 
    //1, 2, 3, 4, 5
    //2, 3, 4, 5, 6
    //3, 4, 5, 6, 7
    for (let i = 0; i <= hand.length - 5; i++) {
        const straightSubset = hand.slice(i, i + 5);

        // Check if the subset forms a straight
        if (isStraightSubset(straightSubset) == 1) {
            return 1;
        }
    }
    return 0;
}

//Return 1 if the 5 card hand is a straight
const isStraightSubset = async (hand) =>{
    let currentRank = hand[0].rank;
    for(let x = 1; x < 5; x++){
        let nextRank = hand[x].rank;

        if(currentRank == nextRank + 1){
            currentRank = nextRank
        }
        else{
            //Next card does not continue the straight pattern
            return 0;
        }
    }
    //If it gets here, then that means we check each card and each card continues the straight
    return 1;
}

//Return 1 if the hand has a flush, return 0 if not
const hasFlush = async (hand) =>{

    let clubCount = 0;
    let diamondCount = 0;
    let heartCount = 0;
    let spadeCount = 0;

    for(const card of hand){

        if(card.suite == 1){
            clubCount++;
        } 
        else if(card.suite == 2){
            diamondCount++;
        }
        else if(card.suite == 3){
            heartCount++;
        }
        else if(card.suite == 4){
            spadeCount++;
        } 
    }

    if(clubCount == 5 || diamondCount == 5 || heartCount == 5 || spadeCount == 5){
        return 1;
    }
    else{
        return 0;
    }
}

const returnFlush = async (hand) =>{
    let clubCount = 0;
    let diamondCount = 0;
    let heartCount = 0;
    let spadeCount = 0;

    let flushHand = [];

    for(const card of hand){

        if(card.suite == 1){
            clubCount++;
        } 
        else if(card.suite == 2){
            diamondCount++;
        }
        else if(card.suite == 3){
            heartCount++;
        }
        else if(card.suite == 4){
            spadeCount++;
        } 
    }

    if(clubCount < 5 && diamondCount < 5 && heartCount < 5 && spadeCount < 5){
        return 0;
    }
    else if (clubCount == 5){
        //If there is a club flush, put every club in flushHand
        for(const card of hand){
            if(card.suite == 1){
                flushHand.push(card);
            } 
        }
        return flushHand;
    }
    else if (diamondCount == 5){
        //If there is a diamond flush, put every diamond in flushHand
        for(const card of hand){
            if(card.suite == 2){
                flushHand.push(card);
            } 
        }
        return flushHand;
    }
    else if (heartCount == 5){
        //If there is a heart flush, put every heart in flushHand
        for(const card of hand){
            if(card.suite == 3){
                flushHand.push(card);
            } 
        }
        return flushHand;
    }
    else if (spadeCount == 5){
        //If there is a spade flush, put every spade in flushHand
        for(const card of hand){
            if(card.suite == 4){
                flushHand.push(card);
            } 
        }
        return flushHand;
    }
}

const hasTrio = async (hand) =>{
    for(let x = 0; x < (hand.length - 2); x++){
        if(hand[x].rank == hand[x+1].rank &&
           hand[x+1].rank == hand[x+2].rank    ){
            return 1;
        }
    }
    return 0;
}

const hasPair = async (hand) =>{
    for(let x = 0; x < (hand.length - 1); x++){
        if(hand[x].rank == hand[x+1].rank){
            return 1;
        }
    }
    return 0;
}

const royalFlush = async (hand) =>{
    let score = 0;

    //Check if the hand has a flush
    if(await hasFlush(hand) == 1){
        let flushedHand = [];
        //Get the all of the cards of the same suite
        flushedHand = await returnFlush(hand);

        let hasTen = 0;
        let hasJack = 0;
        let hasQueen = 0;
        let hasKing = 0;
        let hasAce = 0;

        //Loop through the hand looking for 10 - A
        for(const card of flushedHand){
            if(card == undefined){
                break;
            }
            else if(card.rank == 13){
                hasAce = 1;
            }
            else if(card.rank == 12){
                hasKing = 1;
            }
            else if(card.rank == 11){
                hasQueen = 1;
            }
            else if(card.rank == 10){
                hasJack = 1;
            }
            else if(card.rank == 9){
                hasTen = 1;
            }
        }
        //Check if the hand has 10 - A
        if(hasTen == 1 && hasJack == 1 && hasQueen == 1 && hasKing == 1 && hasAce == 1){
            console.log("Royal Flush");
            score += 1000;
        }
    }
    
    return score;
}

const straightFlush = async (hand) =>{
    let score = 0;

    //Check if the hand has a flush
    if(await hasFlush(hand) == 1){
        let flushedHand = [];
        //Get the all of the cards of the same suite
        flushedHand = await returnFlush(hand);

        if(await hasStraight(flushedHand) == 1){
            //If it has a straight, add 900
            console.log("Straight Flush");
            score += 900;
        }
    }
    
    return score;
}

const fourOfKind = async (hand) =>{
    let score = 0;

    for(let x = 0; x < 4; x++){
        if(hand[x].rank == hand[x+1].rank &&
           hand[x+1].rank == hand[x+2].rank &&
           hand[x+2].rank == hand[x+3].rank    ){
            console.log("Four of a Kind");
            score += 800;
            break;
        }
    }

    return score;
}

const fullHouse = async (hand) =>{
    let score = 0;
    if(await hasTrio(hand) == 1){
        //If a hand has a trio, we need to remove those cards, then test if
        //if it also has a pair
        let rankToRemove;
        for(let x = 0; x < 5; x++){
            if(hand[x].rank == hand[x+1].rank &&
               hand[x+1].rank == hand[x+2].rank    ){
                rankToRemove = hand[x].rank;
            }
        }

        // Remove cards with the specified rank (three of a kind)
        const remainingCards = []

        for(let y = 0; y < 7; y ++){
            if(hand[y].rank != rankToRemove){
                remainingCards.push(hand[y]);
            }
        }
        

        if(await hasPair(remainingCards) == 1){
            console.log("FullHouse");
            score += 700;
        }
    }
    return score;
}

const flush = async (hand) =>{
    let score = 0;

    if(await hasFlush(hand) == 1){
        console.log("Flush");
        score += 600;
    }
    
    return score;
}

const straight = async (hand) =>{
    let score = 0;

    if(await hasStraight(hand) == 1){
        console.log("Straight");
        score += 500;
    }
    
    return score;
}


const oneTrio = async (hand) =>{
    let score = 0;
    if(await hasTrio(hand) == 1){
        console.log("Trio");
        score += 300;
        //Find the highest ranking trio, then add it to score
        for(let x = 0; x < 5; x++){
            if(hand[x].rank == hand[x+1].rank &&
                hand[x+1].rank == hand[x+2].rank    ){
                score += (hand[x].rank * 2);
                if(hand[x].suite > hand[x+1].suite){
                    score += hand[x].suite;
                }

                else{
                    score += hand[x+1].suite;
                }

            }
        }
    }
    
    return score;
}

const onePair = async (hand) =>{
    let score = 0;
    if(await hasPair(hand) == 1){
        console.log("Pair")
        score += 100;
        //Find the highest ranking pair, then add it to score
        for(let x = 0; x < 6; x++){
            if(hand[x].rank == hand[x+1].rank){
                score += (hand[x].rank * 2);
                if(hand[x].suite > hand[x+1].suite){
                    score += hand[x].suite;
                }

                else{
                    score += hand[x+1].suite;
                }

            }
        }
    }
    
    return score;

}


module.exports = { determineWinner };