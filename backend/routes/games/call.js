const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/call";

const handler = async (request, response) => {
    console.log("Starting Call");
    const { id: roomId } = request.params;
    const { id: userId } = request.session.user;

    const io = request.app.get("io");
  

  };
  
  module.exports = { method, route, handler };