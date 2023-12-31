/* eslint-disable camelcase */
/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 *
 */
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("players", {
        user_id: {
            type: "integer",
            // The user's ID
            //references: "users(user_id)",
            notNull: true,
        },
        room_id: {
            type: "integer",
            // The ID of the game this player is in
            //references: "room(room_id)",
            notNull: true,
        },
        username: {
            type: "varchar(256)",
            notNull: true,
        },
        bank: {
            type: "integer",
            // How much money a user has in a room
            default: 100, // Default value set to 100
        },
        folded: {
            type: "integer",
            // If a player has folded in a current round and is not playing
            default: 0, // Default value set to false (0 in boolean context)
        },
        gambled:{
            type: "integer",
            // This is how much money a player gambled in a round
            default: 0, 
        }
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("players");
};

