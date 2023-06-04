const express = require("express");
const { getUserData, createUser, updateUser, deleteUser } = require("../../controller/usersController");
const verifyJWT = require("../../middleware/auth/verifyJWT");

const router = express.Router();

router
  .route("/")
  .get(verifyJWT, getUserData)
  .post(createUser)
  .patch(verifyJWT, updateUser)
  .delete(verifyJWT, deleteUser);

module.exports = router;
