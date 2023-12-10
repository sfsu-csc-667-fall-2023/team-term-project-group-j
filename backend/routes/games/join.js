const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "get";
const route = "/:id/join";

const handler = async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;
  
    const userInGame = await Games.isPlayerInGame(gameId, userId);
  
    if (!userInGame && Games.getUserCount(gameId) < 5) {
        Games.addUser(userId, gameId);
        io.emit(GAME_CONSTANTS.USER_ADDED, { userId, gameId });

        response.redirect(`/games/${gameId}`);
    }
    else{
        console.error("Could not add the user " + userId + " to the game " + gameId);
    }
    
  };
  
  module.exports = { method, route, handler };