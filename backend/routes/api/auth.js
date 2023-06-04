const express = require("express");
const { login, refresh, logout } = require("../../controller/authController");
const loginLimiter = require("../../middleware/auth/loginLimiter");

const router = express.Router();

router.post("/login", loginLimiter, login);
router.get("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
