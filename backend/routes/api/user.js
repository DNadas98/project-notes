const express = require("express");
const { getUserData, createUser, updateUser, deleteUser } = require("../../controller/userController");
const verifyJWT = require("../../middleware/auth/verifyJWT");
const verifyUser = require("../../middleware/auth/verifyUser");

const router = express.Router();

router.post("/", createUser);

router.use(verifyJWT, verifyUser);

router.route("/").get(getUserData).patch(updateUser).delete(deleteUser);

module.exports = router;
