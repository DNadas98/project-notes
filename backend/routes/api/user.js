const express = require("express");
const { getUserData, createUser, updateUser, deleteUser } = require("../../controller/usersController");
const verifyJWT = require("../../middleware/auth/verifyJWT");
const verifyUser = require("../../middleware/auth/verifyUser");

const router = express.Router();

router
  .route("/")
  .get(verifyJWT, verifyUser, getUserData)
  .post(createUser)
  .patch(verifyJWT, verifyUser, updateUser)
  .delete(verifyJWT, verifyUser, deleteUser);

module.exports = router;
