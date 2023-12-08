const db = require("./connection").connection;

//sql
//check up if the user exist 
const USER_EXISTENCE = "SELECT email FROM users WHERE email=$1";
const ADD_USER = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email";
const SIGN_USER_IN = "SELECT * FROM users WHERE email=$1";


const email_exists = (email) =>

  db.one(USER_EXISTENCE, [email])
    .then((_) => true)
    .catch((_) => false);

const create = (email, username, password) => db.one(ADD_USER, [email, username, password]);

const find_by_email = (email) => db.one(SIGN_USER_IN, [email]);
    

module.exports = {
    email_exists,
    create,
    find_by_email,
};