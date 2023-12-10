const express = require("express");
const router = express.Router();

const gameRoutes = require("./games/index.js");

gameRoutes.forEach(({ method, route, handler }) => {
  router[method](route, handler);
});

module.exports = router;