const database = require("../../connection");
const { connection: db } = database;

const {getCurrentTurn} = require("../getters/getCurrentTurn.js");

const userIsCurrentTurn = async (userId, roundId) => {
    const result = await getCurrentTurn(roundId);

    if(userId == result.currentTurn_id){
        return 1;
    }
    return 0;
};

module.exports = { userIsCurrentTurn };