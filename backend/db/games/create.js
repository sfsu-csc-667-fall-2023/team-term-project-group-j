const database = require("../connection");
const { connection: db } = database;

const CREATE_GAME = `
    INSERT INTO room (game_socket_id, host_id, players, round_id)
    VALUES ($1, $2, $3, -1)
    RETURNING id
`;


const create = (gameSocketId, userId) => {
    //Create players array with a max player size of 5
    let players = new Array(5).fill(-1);

    //Add the userId to the players array
    players[0] = userId;
    
    return db.one(CREATE_GAME, [gameSocketId, userId, players]);
}


module.exports = { create };