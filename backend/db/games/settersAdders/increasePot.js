const database = require("../../connection");
const { connection: db } = database;

const INCREASE_POT = `
  UPDATE rounds
  SET pot = pot + $2
  WHERE id=$1
  RETURNING pot
`;

const increasePot = (roundId, money) => db.one(INCREASE_POT, [roundId, money]);

module.exports = { increasePot };