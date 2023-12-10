const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/join";

const handler = async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;

    const io = request.app.get("io");
  
    const userInGame = await Games.isPlayerInGame(gameId, userId);

    if(await Games.doesGameExist(gameId)){
        if (!userInGame && await Games.getUserCount(gameId) < 5 && (await Games.getRoundId(gameId)).round_id == -1 ) {
            console.log("Add User");
            Games.addUser(userId, gameId);
            io.emit(GAME_CONSTANTS.USER_ADDED, { userId, gameId });
    
            response.redirect(`/games/${gameId}`);
        }
        else{
            console.error("Could not add the user " + userId + " to the game " + gameId);
        }
    }
    else{
        console.error("Game " + gameId + " does not exist");
    }
  };
  
  module.exports = { method, route, handler };