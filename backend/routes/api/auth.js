const express = require("express");
const { login, refresh, logout } = require("../../controller/authController");
const loginLimiter = require("../../middleware/auth/loginLimiter");
const verifyJWT = require("../../middleware/auth/verifyJWT");
const verifyUser = require("../../middleware/auth/verifyUser");

const router = express.Router();

router.post("/login", loginLimiter, login);
router.get("/refresh", verifyJWT, verifyUser, refresh);
router.get("/logout", verifyJWT, verifyUser, logout);

module.exports = router;
