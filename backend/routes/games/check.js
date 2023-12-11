const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/check";

const handler = async (request, response) => {
console.log("Starting Check");
    const { id: roomId } = request.params;
    const { id: userId } = request.session.user;

    const roundIdObject = await Games.getRoundId(roomId);
    const roundId = roundIdObject.round_id;

    const io = request.app.get("io");

    if (roundId !== undefined) {
        console.log(roundId);
        console.log();
        console.log((await Games.getPot(roundId)).pot);
      } else {
        console.log("roundId is undefined");
      }

    //Check if in game
    if((await Games.isPlayerInGame(roomId, userId)) == 1){
        //Check if in current turn
        if((await Games.userIsCurrentTurn(userId, roundId)) == 1){
            //Check if pot is empty
            if((await Games.getPot(roundId)).pot < 1){
                //End turn
                await Games.endTurn(roomId, roundId);

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