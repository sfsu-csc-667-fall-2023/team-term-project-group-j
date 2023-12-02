const { render, resolveInclude } = require("ejs");
const express = require("express");
const { request } = require("http");
const { asyncScheduler } = require("rxjs");
const router = express.Router(); 
const bcrypt = require("bcrypt");
const { emit } = require("process");
const SALT_ROUND = 10;
console.log("Before Users import");
const { Users } = require("../db/users");
const { Z_ASCII } = require("zlib");
console.log("After Users import");



router.get("/",(request, response)=>{
  response.render("login");

});
router.post("/signup", async(request,response)=>{
  try{

    const{ username , email, password}= request.body;
console.log("Recived sign up request :", {email, username , password})
if (!Users) {
  console.error("Users module is not loaded");
  response.status(500).send("Internal server error");
  return;
}
//check if the user exsit 
const user_exists = await Users.email_exists(email);
if(user_exists){
  response.redirect("/");
  return;
}
//Encrypt the clear text password
const salt = await bcrypt.genSalt(SALT_ROUND);
const hash = await bcrypt.hash(password, salt);


//stor in db 
const {id } = Users.create(email, hash);

//redirect to gamelobby 
 response.redirect("/gamelobby")
//response.status(200).send("Signup Successfull");
//response.redirect("/login");
  }catch(error){
    console.error("error during sign up ", error);
    response.status(500).send("internal might be a server error")
  }

});
router.post("/login", async(request,response)  => {
  const {email, password} = request.body;
try{
  const users = await Users.find_by_email(email);
  const isValiduser = await bcrypt.compare(password, users.password);


  //redirect to gamlobby if user is valid
if(isValiduser){
 response.redirect("/gamelobby");
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