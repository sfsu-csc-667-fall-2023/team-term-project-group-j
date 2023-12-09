const database = require("../../connection");
const { connection: db } = database;

const GET_CARD = `
  SELECT * FROM cards
  WHERE id=$1
`;

const getCard = (cardId) => db.one(GET_CARD, [cardId]);

module.exports = { getCard };