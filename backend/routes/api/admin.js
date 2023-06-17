const express = require("express");
const verifyJWT = require("../../middleware/auth/verifyJWT");
const verifyUser = require("../../middleware/auth/verifyUser");
const verifyRoles = require("../../middleware/auth/verifyRoles");
const { getAllUsers, getUserById, updateUserById, deleteUserById } = require("../../controller/adminUsersController");
const {
  getNotesOfUser,
  getAllNotes,
  createNote,
  updateNote,
  deleteNote
} = require("../../controller/adminNotesController");

const router = express.Router();

router.use(verifyJWT, verifyUser, (req, res, next) => verifyRoles(req, res, next, ["Admin"]));

router.route("/users").get(getAllUsers).patch(updateUserById).delete(deleteUserById);
router.route("/users/:id").get(getUserById);
router.route("/notes").get(getAllNotes).post(createNote).patch(updateNote).delete(deleteNote);
router.route("/notes/:id").get(getNotesOfUser);

module.exports = router;
