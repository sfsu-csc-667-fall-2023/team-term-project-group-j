const crypto = require("crypto");

const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "get";
const route = "/create";

const handler = async (request, response) => {

    const { id: userId } = request.session.user;
    const io = request.app.get("io");

    const gameSocketId =  crypto.randomBytes(20).toString("hex");

    const gameId = await Games.create( gameSocketId, userId);

    io.emit(GAME_CONSTANTS.CREATED, { id: gameId.id, createdBy: userId });

    response.redirect(`/games/${gameId.id}`);
};

module.exports = { method, route, handler };