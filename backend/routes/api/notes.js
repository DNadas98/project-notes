const express = require("express");
const verifyJWT = require("../../middleware/auth/verifyJWT");
const verifyUser = require("../../middleware/auth/verifyUser");
const { getNotes, createNote, updateNote, deleteNote } = require("../../controller/notesController");

const router = express.Router();

router.route("/").use(verifyJWT, verifyUser).get(getNotes).post(createNote).patch(updateNote).delete(deleteNote);

module.exports = router;
