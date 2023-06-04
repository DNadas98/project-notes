const express = require("express");
const { getNotesOfUser, getAllNotes, createNote, updateNote, deleteNote } = require("../../controller/notesController");
const verifyJWT = require("../../middleware/auth/verifyJWT");

const router = express.Router();

router.route("/").use(verifyJWT).get(getNotesOfUser).post(createNote).patch(updateNote).delete(deleteNote);
router.get("/all", verifyJWT, getAllNotes);

module.exports = router;
