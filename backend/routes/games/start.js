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

        //io.to(request.body.gameSocketId).emit(GAME_CONSTANTS.STATE_UPDATED, state);

        //Broadcast the user's cards
        console.log("BroadCast");
        //const userCards = await Games.getUserCards(userId, roomId);
        //console.log("User socket: " + Users.getUserSocket(userId));
        //io.to(request.body.userSocketId).emit(GAME_CONSTANTS.STATE_UPDATED, { userId, userCards });

        response.status(200).send();
    }
    else{
        console.log("Could not start the game");
    }
  };
  
  module.exports = { method, route, handler };