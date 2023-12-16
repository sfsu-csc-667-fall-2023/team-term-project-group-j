const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/raise";

const handler = async (request, response) => {

    const { id: roomId } = request.params;
    const { id: userId } = request.session.user;
    const raiseAmount = request.body.raiseCount;

    const roundIdObject = await Games.getRoundId(roomId);
    const roundId = roundIdObject.round_id;

    const io = request.app.get("io");

    //Check if in game
    if((await Games.isPlayerInGame(roomId, userId)) == 1){
        //Check if in current turn
        if((await Games.userIsCurrentTurn(userId, roundId)) == 1){
            //Check if the raise count is higher than the blind
            const blindResult = await Games.getBlind(roundId);
            const blind = blindResult.blind;

            if(blind < raiseAmount){
                //check if the player has enough money to do that
                const bankResult = await Games.getPlayerMoney(userId, roomId);
                const playerBank = bankResult.bank;
                
                if(raiseAmount <= playerBank){
                    //Check how much money the player has gambled already
                    const gambledResult = await Games.getPlayerGambled(userId, roomId);
                    const playerGambled = gambledResult.gambled;

                    const moneyToAdd = raiseAmount - playerGambled;

                    //Raise blind
                    await Games.raiseBlind(roundId, userId, raiseAmount);
                    //Subtract the player's money
                    await Games.subPlayerMoney(userId, roomId, moneyToAdd);
                    //Increase the pot
                    await Games.increasePot(roundId, moneyToAdd);
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
                    console.log("Illegal move: Not enough Money");
                }
            }
            else{
                console.log("Illegal move: Less than blind");
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