/* eslint-disable camelcase */
/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 *
 */
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("room", {
        room_id: {
            type: "integer",
            primaryKey: true,
            notNull: true,
        },
        host_id: {
            type: "integer",
            notNull: true,
            // ID of the user who created the room
            // We might not need this since players[0] also keeps track of that
            
        },
        round_id: {
            type: "integer",
            notNull: true,           
            // ID of the current round
            
        },
        players: {
            type: "integer[]",
            notNull: true,
            // Players participating in this game.
            // This should also be the turn order of the players
            
        },
        chat_id: {
            type: "integer",
            notNull: true,
            // Reference to the conversation for this game
            
        },
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("room");
};
