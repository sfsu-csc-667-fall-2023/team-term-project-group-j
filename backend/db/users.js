const db = require("./connection");
//sql
//check up if the user exist 
const USER_EXISTENCE="SELECT COUNT(*) FROM users WHERE email =$1";
const ADD_USER="INSERT INTO users(email, password) VALUES ($1,$2) RETURNING id, email ";
const SIGN_USER_IN="SELECT * FROM users WHERE email =$1";


const email_exists= (email) => {
    try{
        return db.one(USER_EXISTENCE,[email]).then (_ => true);
    }catch(error){
        console.error("Error: Email Exists", error );
        throw error;
        return Promise.resolve(false);
    }
  
};
const create  = (email, password) => {
    try{
        db.one(ADD_USER, [email, password]);
    }catch(error){
        console.error("Error:Creating User Account", error );
        throw error;
    }
}
const find_by_email= (emial) => db.one(SIGN_USER_IN,[email]) ;
    

module.exports = {
    email_exists,
    create,
    find_by_email,
};
