const express = require("express");
const { getNotesOfUser, getAllNotes, createNote, updateNote, deleteNote } = require("../../controller/notesController");

const router = express.Router();

router.route("/").get(getNotesOfUser).post(createNote).patch(updateNote).delete(deleteNote);
router.get("/all", getAllNotes);

module.exports = router;
