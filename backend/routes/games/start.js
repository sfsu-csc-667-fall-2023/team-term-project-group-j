const { Users, Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/start";

const handler = async (request, response) => {
    const { id: roomId } = request.params;
    const { id: userId } = request.session.user;

    const io = request.app.get("io");
  
    if(await Games.getUserCount(roomId) > 1 && userId == await Games.getGameHost(roomId)){
        await Games.startGame(roomId);

        //Broadcast the game's state to everyone
        console.log("BroadCast game state");
        const gameState = await Games.getGameState(roomId);
        console.log("Game socket: " + request.body.gameSocketId);
        console.log(gameState);
        io.to(request.body.gameSocketId).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);

        response.status(200).send();
    }
    else{
        console.log("Could not start the game");
    }
  };
  
  module.exports = { method, route, handler };

  