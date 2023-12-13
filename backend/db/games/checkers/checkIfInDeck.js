const database = require("../../connection");
const { connection: db } = database;

const { getCard } = require("../getters/getCard");

const checkIfInDeck = async (rank, suite, deck) => {
//console.log("\nChecking card of rank " + rank + " suite " + suite)
    try {
        if(deck == null){
            return 0;
        }

        // Check if any card in the deck has the same rank and suite
        for(let x = 0; x < deck.length; x++){
            //Skip the card if the card id is -1
            if(deck[x] != -1){
                const card = await getCard(deck[x]);
                if(card.rank == rank && card.suite == suite){
                    // Return 1 the current card has the same suite and rank
                    //console.log("Already in the deck");
                    return 1;
                }
            }
            
        }
        //If it gets here then the current card is not in the deck
        return 0;
    } catch (error) {
        console.error("Error checking if card is in deck:", error);
        throw error;
    }
};


module.exports = { checkIfInDeck };