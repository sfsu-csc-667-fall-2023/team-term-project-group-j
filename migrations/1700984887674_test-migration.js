/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {};

exports.down = pgm => {};


/*eslint-disable camelcase */
/**
* @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm */

/**
* @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm */
exports.down = (pgm) =>
 { 
    pgm.dropTable("test_table");
};