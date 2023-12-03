/* eslint-disable camelcase */
/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 *
 */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("users", {
        id: 'id',
        username: {
            type: "varchar(256)",
            notNull: true,
        },
        email: {
            type: "varchar(256)", // Corrected the typo here
            notNull: true,
            unique: true,
        },
        password: {
            type: "char(60)",
            notNull: true,
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
};


/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 *
 */

exports.down = (pgm) => {
    pgm.dropTable("users");
};


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
            references: "users(user_id)",
        },
        round_id: {
            type: "integer",
            notNull: true,           
            // ID of the current round
            references: "rounds(round_id)",
        },
        players: {
            type: "integer[]",
            notNull: true,
            // Players participating in this game.
            // This should also be the turn order of the players
            references: "users(user_id)",
        },
        chat_id: {
            type: "integer",
            notNull: true,
            // Reference to the conversation for this game
            references: "conversations(convo_id)",
        },
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("room");
};


exports.up = pgm => {
    pgm.createTable("rounds", {
        round_id: {
            type: "integer",
            primaryKey: true,
            notNull: true,
        },
        raiser_id: {
            type: "integer",
            // User ID of the raiser
            references: "users(user_id)",
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
            references: "users(user_id)",
            notNull: true,
        },
        deck: {
            type: "integer[52]",
            // ID of the 52 cards that are in the game
            references: "cards(card_id)",
            notNull: true,
        },
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("rounds");
};


exports.up = pgm => {
    pgm.createTable("players", {
        user_id: {
            type: "integer",
            // The user's ID
            references: "users(user_id)",
            notNull: true,
        },
        room_id: {
            type: "integer",
            // The ID of the game this player is in
            references: "room(room_id)",
            notNull: true,
        },
        bank: {
            type: "integer",
            // How much money a user has in a room
            default: 100, // Default value set to 100
        },
        folded: {
            type: "boolean",
            // If a player has folded in a current round and is not playing
            default: false, // Default value set to false (0 in boolean context)
        },
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("players");
};


exports.up = pgm => {
    pgm.createTable("cards", {
        card_id: {
            type: "integer",
            primaryKey: true,
        },
        rank: {
            type: "integer",
            notNull: true,
        },
        suite: {
            type: "integer",
            notNull: true,
        },
        user_id: {
            type: "integer",
            notNull: true,
            default: 0,
        },
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("cards");
};

exports.up = pgm => {
    pgm.createTable("conversations", {
        convo_id: {
            type: "integer",
            primaryKey: true,
            notNull: true,
        },
        users: {
            type: "integer[]",
            // Users inside the conversation
            notNull: true,
            references: "users(user_id)",
        },
        messages: {
            type: "integer[]",
            // Messages inside the conversation
            references: "messages(message_id)",
        },
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("conversations");
};


exports.up = pgm => {
    pgm.createTable("messages", {
        message_id: {
            type: "integer",
            primaryKey: true,
            notNull: true,
        },
        fromUser_id: {
            type: "integer",
            // User who sent the message
            notNull: true,
            //references: "users(user_id)",
        },
        body: {
            type: "text",
            // Content of the message
            note: 'Content of the message',
        },
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("messages");
};







