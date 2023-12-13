const database = require("../../connection");
const { connection: db } = database;

const {roundFoldPlayer} = require("../settersAdders/roundFoldPlayer.js");
const {getPlayerMoney} = require("../getters/getPlayerMoney.js");
const {setCurrentPlayer} = require("../settersAdders/setCurrentPlayer.js");
const {dealCard} = require("../settersAdders/dealCard.js");

const UPDATE_ROUND = `
    UPDATE rounds
    SET raiser_id = -1,
        blind = 5,
        pot = 0
    WHERE id=$1
    RETURNING id
`;

const GET_PLAYERS = `
    SELECT players FROM room
    WHERE id=$1
`;

const RESET_GAMBLED =`
    UPDATE players
    SET gambled = 0
    WHERE user_id=$1 AND room_id=$2
    RETURNING gambled
`;

const startRound = async (roundId, roomId) => {
    //console.log("startRound");
    await roundFoldPlayer(roomId);

    //Determine first player in the order with money
    let currentTurn_id = -1;
    const result = await db.oneOrNone(GET_PLAYERS, [roomId]);

    const playersString = String(result.players);
    const players = [];

    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
        if(playerId != -1){
            //Set this player's gambled to 0
        await db.one(RESET_GAMBLED, [playerId, roomId]);
        }
    }

    //Find the first player who has money and make them the current turn
    for (const playerId of players) {
        if (playerId !== -1) {
            const moneyStatus = await getPlayerMoney(playerId, roomId);
            if (moneyStatus.bank > 0) {
                currentTurn_id = playerId;
                break;
            }
        }   
    }

    if(currentTurn_id == -1){
        //could not start the round
        console.log("Cound not start round");
        return 0;
    }

    //This will set the round's current player
    await setCurrentPlayer[currentTurn_id, roundId];

    //This will reset the round's values
    await db.one(UPDATE_ROUND, [roundId]);

    //This will set the round's deck
    await dealCard(roomId);

    return 1;
}

module.exports = { startRound };