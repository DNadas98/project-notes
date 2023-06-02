const express = require("express");
const { login, refresh, logout } = require("../../controller/authController");
const loginLimiter = require("../../middleware/loginLimiter");
const router = express.Router();

router.post("/", loginLimiter, login);
router.get("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
