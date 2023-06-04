const express = require("express");
const { login, refresh, logout } = require("../../controller/authController");
const loginLimiter = require("../../middleware/auth/loginLimiter");
const verifyJWT = require("../../middleware/auth/verifyJWT");

const router = express.Router();

router.post("/login", loginLimiter, login);
router.get("/refresh", verifyJWT, refresh);
router.post("/logout", logout);

module.exports = router;
