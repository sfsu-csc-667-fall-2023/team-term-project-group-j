const { render, resolveInclude } = require("ejs");
const express = require("express");
const { Games } = require("../db/index")
const router = express.Router(); 

router.get("/",(request, response)=>{
    

    response.render("gamelobby")
});

module.exports = router; 