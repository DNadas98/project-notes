const express = require("express");
const { getNotes, createNote, updateNote, deleteNote } = require("../../controller/notesController");
const verifyJWT = require("../../middleware/auth/verifyJWT");

const router = express.Router();

router.route("/").get(getNotes).post(createNote).patch(updateNote).delete(deleteNote);

module.exports = router;
