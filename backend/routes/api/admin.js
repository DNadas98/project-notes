const express = require("express");
const verifyJWT = require("../../middleware/auth/verifyJWT");
const verifyRoles = require("../../middleware/auth/verifyRoles");
const { getAllUsers, createUser, updateUser, deleteUser } = require("../../controller/adminUsersController");
const {
  getNotesOfUser,
  getAllNotes,
  createNote,
  updateNote,
  deleteNote
} = require("../../controller/adminNotesController");

const router = express.Router();

router
  .route("/users")
  .post(createUser) /*
  .use(verifyJWT)
  .use((req, res, next) => verifyRoles(req, res, next, ["Admin"]))*/
  .get(getAllUsers)
  .patch(updateUser)
  .delete(deleteUser);

router
  .route("/notes") /*
  .use(verifyJWT)
  .use((req, res, next) => verifyRoles(req, res, next, ["Admin"]))*/
  .get(getNotesOfUser)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote);
router
  .route("/notes/all") /*
  .use(verifyJWT)
  .use((req, res, next) => verifyRoles(req, res, next, ["Admin"]))*/
  .get(getAllNotes);

module.exports = router;
