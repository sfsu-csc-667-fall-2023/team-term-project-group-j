const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/check";

const handler = async (request, response) => {
    const { id: roomId } = request.params;
    const { id: userId } = request.session.user;

    const roundIdObject = await Games.getRoundId(roomId);
    const roundId = roundIdObject.round_id;

    const io = request.app.get("io");

    //Check if in game
    if((await Games.isPlayerInGame(roomId, userId)) == 1){
        //Check if in current turn
        if((await Games.userIsCurrentTurn(userId, roundId)) == 1){
            //Check if pot is empty
            if((await Games.getPot(roundId)).pot < 1){
                //End turn
                await Games.endTurn(roomId, roundId);

                //Broadcast the game's state to everyone
                console.log("BroadCast game state");
                const gameState = await Games.getGameState(roomId);
                console.log("Game socket: " + request.body.gameSocketId);
                console.log(gameState);
                io.to(request.body.gameSocketId).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);
            }
            else{
                console.log("Illegal move");
            }
        }
        else{
            console.log("Not current turn");
        }
    }
    else{
        console.log("User is not in the game");
    }

  };
  
  module.exports = { method, route, handler };