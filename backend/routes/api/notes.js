const express = require("express");
const { getNotesOfUser, getAllNotes, createNote, updateNote, deleteNote } = require("../../controller/notesController");
const verifyJWT = require("../../middleware/auth/verifyJWT");

const router = express.Router();

router
  .route("/")
  .get(verifyJWT, getNotesOfUser)
  .post(verifyJWT, createNote)
  .patch(verifyJWT, updateNote)
  .delete(verifyJWT, deleteNote);
router.get("/all", verifyJWT, getAllNotes);

module.exports = router;
