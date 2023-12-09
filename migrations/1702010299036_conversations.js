/* eslint-disable camelcase */
/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 *
 */
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("conversations", {
        id: 'id',
        users: {
            type: "integer[]",
            // Users inside the conversation
            notNull: true,
            //references: "users(user_id)",
        },
        messages: {
            type: "integer[]",
            // Messages inside the conversation
            //references: "messages(message_id)",
        },
    });
};

/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable("conversations");
};

