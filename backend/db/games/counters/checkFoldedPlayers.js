const database = require("../../connection");
const { connection: db } = database;

const getPlayerFolded = require("../checkers/getPlayerFolded.js");
const getRoundId = require("../getters/getRoundId.js")

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const checkFoldedPlayers = (gameId) => {
    const players =  db.oneOrNone(GET_PLAYERS, [gameId]);
    const roundId = getRoundId(gameId);

    if (players) {
        let foldedCount = 0;

        for (const playerId of players) {
            if (playerId !== -1) {
                const foldedStatus = getPlayerFolded(playerId, roundId);
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