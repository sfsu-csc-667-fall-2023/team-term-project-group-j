const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "get";
const route = "/:id";

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (request, response) => {
    const { id } = request.params;
    
    const { id: userId } = request.session.user;

    const { game_socket_id: gameSocketId } = await Games.getGame(id);
    const { host_id: gameHostId } = await Games.getGame(id);
    const { sid: userSocketId } = await Users.getUserSocket(userId);

    //Check if the game has started
    const {round_id: roundId } = await Games.getRoundId(id);

    response.render("gamelobby", { id, gameSocketId, userSocketId, gameHostId, roundId});
    
    await wait(1000);
    const io = request.app.get("io");
    console.log("BroadCast game state");
    const gameState = await Games.getGameState(id);
    console.log("Game socket: " + gameSocketId);
    console.log(gameState);
    io.to(gameSocketId).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);
};

module.exports = { method, route, handler };