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






