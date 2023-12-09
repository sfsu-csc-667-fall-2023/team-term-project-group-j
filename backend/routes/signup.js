const { render, resolveInclude } = require("ejs");
const express = require("express");
const router = express.Router(); 

router.get("/",(request, response)=>{
  response.render("signup")
});


module.exports = router; 