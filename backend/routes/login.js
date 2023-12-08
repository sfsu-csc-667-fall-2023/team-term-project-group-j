const { render, resolveInclude } = require("ejs");
const express = require("express");
const router = express.Router(); 


router.get("/",(request, response)=>{
  response.render("login");

router.post("/login", (request, response) => {
    // Process login data
  
  }); 
});


module.exports = router; 