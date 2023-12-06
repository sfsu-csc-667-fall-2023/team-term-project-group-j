const db = require("./connection").connection;

//sql
//check up if the user exist 
const USER_EXISTENCE = "SELECT email FROM users WHERE email=$1";
const ADD_USER = "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email";
const SIGN_USER_IN = "SELECT * FROM users WHERE email=$1";


const email_exists = (email) =>

  db.one(USER_EXISTENCE, [email])
    .then((_) => true)
    .catch((_) => false);

<<<<<<< HEAD
const create = (email, username, password) => db.one(ADD_USER, [email, username, password]);

const find_by_email = (email) => db.one(SIGN_USER_IN, [email]);
=======
const create = (email, password) => db.one(ADD_USER, [email, password]);

const find_by_email= (email, password) => db.one(SIGN_USER_IN,[email, password]);
>>>>>>> 66fbe9f (added player room)
    

module.exports = {
    email_exists,
    create,
    find_by_email,
};