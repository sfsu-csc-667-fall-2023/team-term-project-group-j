const { render, resolveInclude } = require("ejs");
const express = require("express");
const { request } = require("http");
const { asyncScheduler } = require("rxjs");
const router = express.Router(); 


router.get("/",(request, response)=>{
  response.render("signup")

});
router.post("/signup", async(request,response)=>{
  try{

    const{ username , email, password}= request.body;
console.log("Recived sign up request :", {email, username , password})
response.status(200).send("Signup Successfull");
  }catch(error){
    console.error("error during sign up ", error);
    response.status(500).send("internal might be a server error")
  }

});
router.post("/login", async(request,response)=>{
  
}) 


module.exports = router; 