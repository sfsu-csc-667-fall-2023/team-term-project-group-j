/* eslint-disable camelcase */
/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 *
 */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("messages", {
        id: 'id',
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
