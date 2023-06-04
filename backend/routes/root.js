const express = require("express");

const router = express.Router();

//test error
router.use("/err", (req, res, next) => {
  try {
    throw new Error("Test error");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
