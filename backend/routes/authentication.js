const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {Users} = require("../db/index");
const SALT_ROUNDS= 10 

router.get("/signup", (request, response)=>{

});
//sign up end point 
router.post("/signup", async(request, response)=>{
  const{ email , password } = request.body;
  //console.log(Users);
  //console.log({email, password});
const user_exists = await Users.email_exists(email);
if(user_exists){
  response.redirect("/gamelobby");
}
//Encryptions 
const salt= await bcrypt.genSalt(SALT_ROUNDS);
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
router.post("/gamelobby", async(request,response)  => {
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