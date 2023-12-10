const database = require("../../connection");
const { connection: db } = database;

const {getCurrentTurn} = require("../getters/getCurrentTurn.js");

const userIsCurrentTurn = async (userId, roundId) => {

    if(userId == await getCurrentTurn(roundId)){
        return 1;
    }

    return 0;
};

module.exports = { userIsCurrentTurn };