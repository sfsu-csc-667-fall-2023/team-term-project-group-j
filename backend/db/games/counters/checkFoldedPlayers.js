const database = require("../../connection");
const { connection: db } = database;

const {getPlayerFolded} = require("../checkers/getPlayerFolded.js");
const {getRoundId} = require("../getters/getRoundId.js")

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const checkFoldedPlayers = async (gameId) => {
    const result = await db.oneOrNone(GET_PLAYERS, [gameId]);

    const playersString = String(result.players);
    const players = [];
    // Manually populate the playersArray
    for (const player of playersString.split(',')) {
        const playerId = parseInt(player, 10);
        players.push(playerId);
    }
    const roundResult = await getRoundId(gameId);
    const roundId = roundResult.round_id;
    if (players) {
        let foldedCount = 0;
        for (const playerId of players) {
            if (playerId !== -1) {
                const foldedStatus = await getPlayerFolded(playerId, roundId);
                if (foldedStatus !== -1) {
                    foldedCount++;
                }
            }
        }
        return foldedCount;
    } else {
        // Handle the case where no players are found
        return 0;
    }
};
module.exports = { checkFoldedPlayers };