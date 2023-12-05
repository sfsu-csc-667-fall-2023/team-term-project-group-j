const { render, resolveInclude } = require("ejs");
const express = require("express");
const router = express.Router(); 


router.get("/",(request, response)=>{
  response.render("login");

router.post("/login", (request, response) => {
    // Process login data
  
    // Redirect to the gamelobby page upon successful login
response.redirect("/gamelobby");
  }); 
});


module.exports = router; 