const express = require("express");
const { getAllUsers, createUser, updateUser, deleteUser } = require("../../controller/usersController");

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser).patch(updateUser).delete(deleteUser);

module.exports = router;
