const database = require("../../connection");
const { connection: db } = database;

const CREATE_PLAYER =  `
    INSERT INTO players (user_id, roomId, bank, folded) 
    VALUES ($1, $2, 100, 0)
    RETURNING user_id
`;

const GET_PLAYERS = `
  SELECT players FROM room
  WHERE id=$1
`;

const UPDATE_PLAYERS = `
  UPDATE room
  SET players[] = $2
  WHERE id=$1
  RETURNING players
`;

const addUser = (userId, gameId) => {
    try {
        const players = db.one(GET_PLAYERS, [gameId]);

        // Find the first empty slot (-1) in the players array
        const emptySlotIndex = players.indexOf(-1);

        if (emptySlotIndex !== -1) {
            // Update the players array with the new user at the empty slot
            players[emptySlotIndex] = userId;

            // Create the player in the player table
            db.one(CREATE_PLAYER, [userId, gameId]);

            // Perform the update in the database
            db.one(UPDATE_PLAYERS, [gameId, players]);

            // Return success
            return 1;
        } else {
            // Handle the case where no empty slot is found
            console.log("No empty slot available for the new user.");
            return 0;
        }
    } catch (error) {
        // Handle the error, e.g., log it or throw a custom error
        console.error("Error adding user to players array:", error);
        throw 0;
    }
};

module.exports = { addUser };