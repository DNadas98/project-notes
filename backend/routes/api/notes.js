const express = require("express");
const verifyJWT = require("../../middleware/auth/verifyJWT");
const verifyUser = require("../../middleware/auth/verifyUser");
const { getNotes, getNoteById, createNote, updateNote, deleteNote } = require("../../controller/notesController");

const router = express.Router();

router.use(verifyJWT, verifyUser);

router.route("/").get(getNotes).post(createNote).patch(updateNote).delete(deleteNote);
router.get("/:id", verifyJWT, verifyUser, getNoteById);

module.exports = router;
