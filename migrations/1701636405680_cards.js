/* eslint-disable camelcase */
/** 
 * @param{import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 *
 */
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("cards", {
        id: 'id',
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

