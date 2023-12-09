const database = require("../../connection");
const { connection: db } = database;

const getCurrentTurn = require("../getters/getCurrentTurn.js");

const userIsCurrentTurn = (userId, roundId) => {

    if(userId == getCurrentTurn(roundId)){
        return 1;
    }

    return 0;
};

module.exports = { userIsCurrentTurn };