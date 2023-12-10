/* eslint-disable camelcase */
/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 *
 */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("rounds", {
        id: 'id',
        raiser_id: {
            type: "integer",
            // User ID of the raiser
            //references: "users(user_id)",
        },
        blind: {
            type: "integer",
            // The current minimum amount of money a user needs to bet
            default: 5, // Default value set to 5
        },
        pot: {
            type: "integer",
            // How much money is in the pot
            default: 0, // Default value set to 0
        },
        currentTurn_id: {
            type: "integer",
            // ID of the current turn's player
            //references: "users(user_id)",
            notNull: true,
        },
        deck: {
            type: "integer[]",
            // ID of the cards that are in the game
            //references: "cards(card_id)",
            check: 'array_length(deck, 1) <= 15',
        },
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("rounds");
};
