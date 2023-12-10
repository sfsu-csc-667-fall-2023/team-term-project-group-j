const database = require("../../connection");
const { connection: db } = database;

const {getGame} = require("../getters/getGame.js")
const {playersWithMoneyCount} = require("../counters/playersWithMoneyCount.js");
const {getPlayerMoney} = require("../getters/getPlayerMoney.js");
const {checkIfInDeck} = require("../checkers/checkIfInDeck.js");

const CREATE_ROOM_DECK = `
    UPDATE rounds
    SET deck = $2
    WHERE id=$1
    RETURNING deck
`;

const CREATE_CARD = `
    INSERT INTO cards (rank, suite, user_id) 
    VALUES ($1, $2, $3)
    RETURNING id
`;

const GET_PLAYERS = `
    SELECT players FROM room
    WHERE id=$1
`;

const dealCard = async (roomId) => {

    const game = await getGame(roomId);

    //Find the players with money, make an array of their ids
    const result = await db.oneOrNone(GET_PLAYERS, [roomId]);

    const playersString = String(result.players);
    const players = [];
    
    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
    }

    const peopleWithMoney = await playersWithMoneyCount(roomId);

    let richPeople = new Array(peopleWithMoney);
    let richIndex = 0;
    for(const playerId of players){
        if(playerId == -1){
            break;
        }
        else if((await getPlayerMoney(playerId, roomId)).bank > 0){
            richPeople[richIndex] = playerId;
            richIndex++;
        }
    }

    const deckSize = 5 + (peopleWithMoney * 2);
    let deck = new Array(deckSize).fill(-1);

    let playerOwner = 0;
    let randomRank = Math.floor(Math.random() * (13 - 1 + 1)) + 1;
    let randomSuite = Math.floor(Math.random() * (4 - 1 + 1)) + 1;

    for (let i = 0; i < deckSize; i++) {
        //Generate a random card and check if it is already in the deck
        do{
            randomRank = Math.floor(Math.random() * (13 - 1 + 1)) + 1;
            randomSuite = Math.floor(Math.random() * (4 - 1 + 1)) + 1;

        }while(await checkIfInDeck(game.round_id, randomRank, randomSuite) == 1)

        //Assign the card to an owner
        let owner = 0;

        //Deal community cards first
        if(i == 0){
            owner = -1;
        }
        else if(i == 1){
            owner = -2;
        }
        else if(i == 2){
            owner = -3;
        }
        else if(i == 3){
            owner = -4;
        }
        else if(i == 4){
            owner = -5;
        }

        //Deal player cards
        else if(i == 5){
            owner = richPeople[playerOwner];
        }
        else if(i == 6){
            owner = richPeople[playerOwner];
            playerOwner++;
        }

        else if(i == 7){
            owner = richPeople[playerOwner];
        }
        else if(i == 8){
            owner = richPeople[playerOwner];
            playerOwner++;
        }

        else if(i == 9){
            owner = richPeople[playerOwner];
        }
        else if(i == 10){
            owner = richPeople[playerOwner];
            playerOwner++;
        }

        else if(i == 11){
            owner = richPeople[playerOwner];
        }
        else if(i == 12){
            owner = richPeople[playerOwner];
            playerOwner++;
        }

        else if(i == 13){
            owner = richPeople[playerOwner];
        }
        else if(i == 14){
            owner = richPeople[playerOwner];
            playerOwner++;
        }

        //Create the card and put it in the db
        const result = await db.one(CREATE_CARD, [randomRank, randomSuite, owner]);


        //Put the card's id in the deck
        deck[i] = result.id;
    }
    //Now that the deck is created, add it to the database
    await db.one(CREATE_ROOM_DECK, [roomId, deck]);

};

module.exports = { dealCard };