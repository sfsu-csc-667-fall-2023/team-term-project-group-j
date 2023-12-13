const { create } = require("./games/create");
const { availableGamesForUser } = require("./games/availableGamesForUser.js");

const { checkCC } = require("./games/checkers/checkCC.js");
const { checkIfInDeck } = require("./games/checkers/checkIfInDeck.js");
const { checkRaiserLoop } = require("./games/checkers/checkRaiserLoop.js");
const { doesGameExist } = require("./games/checkers/doesGameExist.js");
const { getPlayerFolded } = require("./games/checkers/getPlayerFolded.js");
const { isPlayerInGame } = require("./games/checkers/isPlayerInGame.js");
const { userIsCurrentTurn } = require("./games/checkers/userIsCurrentTurn.js");

const { checkFoldedPlayers } = require("./games/counters/checkFoldedPlayers.js");
const { playersWithMoneyCount } = require("./games/counters/playersWithMoneyCount.js");

const { determineWinner } = require("./games/gameFunctions/determineWinner.js");
const { endGame } = require("./games/gameFunctions/endGame.js");
const { endRound } = require("./games/gameFunctions/endRound.js");
const { endTurn } = require("./games/gameFunctions/endTurn.js");
const { nextTurn } = require("./games/gameFunctions/nextTurn.js");
const { startGame } = require("./games/gameFunctions/startGame.js");
const { startRound } = require("./games/gameFunctions/startRound.js");

const { getBlind } = require("./games/getters/getBlind.js");
const { getCard } = require("./games/getters/getCard.js");
const { getCurrentTurn } = require("./games/getters/getCurrentTurn.js");
const { getGame } = require("./games/getters/getGame.js");
const { getGameHost } = require("./games/getters/getGameHost.js");
const { getPlayerGambled } = require("./games/getters/getPlayerGambled.js");
const { getPlayerMoney } = require("./games/getters/getPlayerMoney.js");
const { getPot } = require("./games/getters/getPot.js");
const { getRaiser } = require("./games/getters/getRaiser.js");
const { getRoundId } = require("./games/getters/getRoundId.js");
const { getRoundState } = require("./games/getters/getRoundState.js");
const { getUserCards } = require("./games/getters/getUserCards.js");
const { getUserCount } = require("./games/getters/getUserCount.js");

const { addPlayerMoney } = require("./games/settersAdders/addPlayerMoney.js");
const { addUser } = require("./games/settersAdders/addUser.js");
const { dealCard } = require("./games/settersAdders/dealCard.js");
const { foldPlayer } = require("./games/settersAdders/foldPlayer.js");
const { increasePot } = require("./games/settersAdders/increasePot.js");
const { raiseBlind } = require("./games/settersAdders/raiseBlind.js");
const { revealNextCC } = require("./games/settersAdders/revealNextCC.js");
const { roundFoldPlayer } = require("./games/settersAdders/roundFoldPlayer.js");
const { setCurrentPlayer } = require("./games/settersAdders/setCurrentPlayer.js");
const { subPlayerMoney } = require("./games/settersAdders/subPlayerMoney.js");

module.exports = {
    create,
    availableGamesForUser,
  
    checkCC,
    checkIfInDeck,
    checkRaiserLoop,
    doesGameExist,
    getPlayerFolded,
    isPlayerInGame,
    userIsCurrentTurn,
  
    checkFoldedPlayers,
    playersWithMoneyCount,
    
    determineWinner,
    endGame,
    endRound,
    endTurn,
    nextTurn,
    startGame,
    startRound,
  
    getBlind,
    getCard,
    getCurrentTurn,
    getGame,
    getGameHost,
    getPlayerGambled,
    getPlayerMoney,
    getPot,
    getRaiser,
    getRoundId,
    getRoundState,
    getUserCards,
    getUserCount,
  
    addPlayerMoney,
    addUser,
    dealCard,
    foldPlayer,
    increasePot,
    raiseBlind,
    revealNextCC,
    roundFoldPlayer,
    setCurrentPlayer,
    subPlayerMoney,
};