const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/call";

const handler = async (request, response) => {
console.log("Call")
    const { id: roomId } = request.params;
    const { id: userId } = request.session.user;

    const roundIdObject = await Games.getRoundId(roomId);
    const roundId = roundIdObject.round_id;

    const io = request.app.get("io");

    //Check if in game
    if((await Games.isPlayerInGame(roomId, userId)) == 1){
        //Check if in current turn
        if((await Games.userIsCurrentTurn(userId, roundId)) == 1){
            //This is here to quickly test who won the hand
            //await Games.dealCard(roomId);
            //await Games.determineWinner(roomId, roundId);

            //Check if pot is empty
            if((await Games.getPot(roundId)).pot > 0){
                //Get the blind;
                const blindResult = await Games.getBlind(roundId);
                const blind = blindResult.blind;

                //Check how much money the player has
                const bankResult = await Games.getPlayerMoney(userId, roomId);
                const playerBank = bankResult.bank;

                //Check how much money the player has gambled already
                const gambledResult = await Games.getPlayerGambled(userId, roomId);
                const playerGambled = gambledResult.gambled;

                let moneyToGamble = blind - playerGambled;

                if(playerBank < moneyToGamble){
                    moneyToGamble = blind - playerBank;
                }

                await Games.subPlayerMoney(userId, roomId, moneyToGamble);
                await Games.increasePot(roundId, moneyToGamble);

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