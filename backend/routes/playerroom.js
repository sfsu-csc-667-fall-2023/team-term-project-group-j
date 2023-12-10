const { render, resolveInclude } = require("ejs");
const express = require("express");
const router = express.Router(); 

const database = require("../db/connection");
const { connection: db } = database;

const QUERY = `
    SELECT id
    FROM room
    WHERE $1 = ANY(players);
`;

const availableGamesForUser = async (userId) => {
  try {
      const result = await db.manyOrNone(QUERY, [userId]);

      // Extract room_ids from the result
      const roomIds = result.map(row => row.id);

      return roomIds;
  } catch (error) {
      console.error("Error executing SQL query:", error);
      throw error;
  }
}


router.get("/", async (request, response) => {
  try {
      const userGames = await availableGamesForUser(request.session.user.id);

      response.render("playerroom", {userGames});
  } catch (error) {
      // Handle the error, e.g., send an error response
      console.error("Error handling playerroom route:", error);
      response.status(500).send("Internal Server Error");
  }
});


module.exports = router; 