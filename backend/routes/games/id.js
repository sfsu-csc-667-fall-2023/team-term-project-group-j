const { Games, Users } = require("../../db");

const method = "get";
const route = "/:id";

const handler = async (request, response) => {
    const { id } = request.params;
    
    const { id: userId } = request.session.user;

    const { game_socket_id: gameSocketId } = await Games.getGame(id);
    const { host_id: gameHostId } = await Games.getGame(id);
    const { sid: userSocketId } = await Users.getUserSocket(userId);

    //Check if the game has started
    const {round_id: roundId } = await Games.getRoundId(id);

    response.render("gamelobby", { id, gameSocketId, userSocketId, gameHostId, roundId});
};

module.exports = { method, route, handler };