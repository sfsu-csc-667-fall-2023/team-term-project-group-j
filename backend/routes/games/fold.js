const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/fold";

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
            //fold the player
            Games.foldPlayer(userId, roomId);
            //End turn
            await Games.endTurn(roomId, roundId);
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