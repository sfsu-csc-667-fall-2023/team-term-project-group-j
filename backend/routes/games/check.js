const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/check";

const handler = async (request, response) => {
    console.log("Starting Check");
    const { id: roomId } = request.params;
    const { id: userId } = request.session.user;

    const roundId = await Games.getRoundId(gameId).round_id;

    const io = request.app.get("io");

    console.log(roundId);
    console.log(await Games.isPlayerInGame(roomId, userId));
    console.log((await Games.userIsCurrentTurn(roundId)));
    console.log((await Games.getPot(roundId)));

    //Check if in game
    if((await Games.isPlayerInGame(roomId, userId)) == 1){
        //Check if in current turn
        if((await Games.userIsCurrentTurn(roundId)) == 1){
            //Check if pot is empty
            if((await Games.getPot(roundId)) < 1){
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