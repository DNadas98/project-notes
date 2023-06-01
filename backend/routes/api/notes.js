const express = require("express");
const { getAllNotes, createNote, updateNote, deleteNote } = require("../../controller/notesController");

const router = express.Router();

router.route("/").get(getAllNotes).post(createNote).patch(updateNote).delete(deleteNote);

module.exports = router;
