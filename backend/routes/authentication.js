const { render, resolveInclude } = require("ejs");
const express = require("express");
const { request } = require("http");
const { asyncScheduler } = require("rxjs");
const router = express.Router(); 
const bcrypt = require("bcrypt");
const { emit } = require("process");
const SALT_ROUND = 10;

const { Users } = require("../db/index");
//const { Z_ASCII } = require("zlib");



router.get("/login",(request, response)=>{
  response.render("login");

});
router.post("/signup", async(request,response)=>{
  try{

    const{ username , email, password}= request.body;
    console.log("Recived sign up request :", {email, username, password})
    if (!Users) {
      console.error("Users module is not loaded");
      response.status(500).send("Internal server error");
      return;
    }
    //check if the user exsit 
    const user_exists = await Users.email_exists(email);
    if(user_exists){
      response.redirect("login");
      return;
    }
    //Encrypt the clear text password
    const salt = await bcrypt.genSalt(SALT_ROUND);
    const hash = await bcrypt.hash(password, salt);

    //store in db 
    const { id } = Users.create(username, email, hash);
  request.session.id = id; // Use id directly
request.session.email = email; // Use email directly

    //redirect to gamelobby 
    //response.redirect("/gamelobby")
    //response.status(200).send("Signup Successfull");
    response.redirect("/login");
  }catch(error){
    console.error("error during sign up ", error);
    response.status(500).send("internal might be a server error")
  }

});
<<<<<<< HEAD

router.post("/login", async(request,response)  => {
=======
router.post("/gamelobby", async(request,response)  => {
>>>>>>> c8b8d3d82a1becebacffaf97172997e2d0bb31c1
  const {email, password} = request.body;
try{
  const users = await Users.find_by_email(email);
  const isValiduser = await bcrypt.compare(password, users.password);

  //redirect to gamlobby if user is valid
if(isValiduser){
  request.session.id= user.id;
  request.session.email = user.email;
    console.log({user, session: request.session})
 response.redirect("gamelobby");
  return;
}
  else{
    response.redirect("login", {error:"your user and passwords are not valid"});
  }

}catch(error){
console.log(error)
response.redirect("login ",{error:"your user and passwords are not valid"});
}
});

module.exports = router; 