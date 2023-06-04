const express = require("express");
const { getAllUsers, createUser, updateUser, deleteUser } = require("../../controller/usersController");
const verifyJWT = require("../../middleware/auth/verifyJWT");

const router = express.Router();

router.route("/").use(verifyJWT).get(getAllUsers).post(createUser).patch(updateUser).delete(deleteUser);

module.exports = router;
