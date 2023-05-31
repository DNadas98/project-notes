const express = require("express");
//const fs = require('fs');
const path = require("path");
const logger = require("../middleware/logger");

const router = express.Router();

router.get("^/$|/index(.html)?", (req, res) => {
  res.status(200);
  logger.logServed(req, res);
  res.sendFile(path.join(__dirname, "..", "..", "frontend", "views", "index.html"));
});

//Redirects: 301 (Moved Permanently)
router.get("/old(.html)?", (req, res) => {
  res.status(301);
  logger.logServed(req, res);
  res.redirect("/");
});

module.exports = router;
