const express = require("express");
const path = require("path");
const { logServed, logError } = require("../middleware/logger");

const router = express.Router();

router.get("^/$|/index(.html)?", (req, res, next) => {
  try {
    logServed(req, res);
    res.sendFile(path.join(__dirname, "..", "..", "frontend_plainjs", "views", "index.html"));
  } catch (err) {
    logError(err, req);
    next(err);
  }
});

//test error
router.use("/err", (req, res, next) => {
  try {
    throw new Error("Test error");
  } catch (err) {
    next(err);
  }
});

//Redirects: 301 (Moved Permanently)
router.get("/old(.html)?", (req, res, next) => {
  try {
    res.status(301);
    logServed(req, res);
    res.redirect("/");
  } catch (err) {
    logError(err, req);
    next(err);
  }
});

module.exports = router;
