const express = require("express");
const { getUserData, createUser, updateUser, deleteUser } = require("../../controller/usersController");
const verifyJWT = require("../../middleware/auth/verifyJWT");
const verifyUser = require("../../middleware/auth/verifyUser");

const router = express.Router();

router.route("/").post(createUser).use(verifyJWT, verifyUser).get(getUserData).patch(updateUser).delete(deleteUser);

module.exports = router;
