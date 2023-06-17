const express = require("express");
const { login, refresh, logout, validateAccess } = require("../../controller/authController");
const loginLimiter = require("../../middleware/auth/loginLimiter");
const verifyJWT = require("../../middleware/auth/verifyJWT");
const verifyUser = require("../../middleware/auth/verifyUser");
const verifyRoles = require("../../middleware/auth/verifyRoles");

const router = express.Router();

router.post("/login", loginLimiter, login);
router.get("/refresh", refresh);
router.post("/logout", logout);

router.use(verifyJWT, verifyUser);
router
  .get("/validate", validateAccess)
  .get("/validate/admin", (req, res, next) => verifyRoles(req, res, next, ["Admin"]), validateAccess);

module.exports = router;
