const Note = require("../model/schemas/Note");
const { logError } = require("../middleware/logger");

//GET /notes
async function getNotes(req, res, next) {
  try {
    const userid = req.userid;
    const notes = await Note.find({ userid }).lean();
    if (!notes || !Array.isArray(notes) || !notes.length >= 1) {
      return res.status(404).json({ message: "No notes found" });
    }
    return res.status(200).json({ "data": notes });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//POST /notes
async function createNote(req, res, next) {
  try {
    const userid = req.userid;
    const { title, text } = req.body;
    if (!title || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const duplicate = await Note.findOne({ userid, title }).lean();
    if (duplicate) {
      return res.status(409).json({ message: `Note with title ${title} already exists` });
    }
    const noteObject = { "userid": userid, "title": title, "text": text };
    const note = await Note.create(noteObject);
    if (note) {
      return res.status(201).json({ message: `New note ${title} created successfully` });
    }
    return res.status(400).json({ message: "Failed to create new note" });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//PATCH /notes
async function updateNote(req, res, next) {
  try {
    const userid = req.userid;
    const { id, title, text, completed } = req.body;
    if (!id || !title || !text || typeof completed != "boolean") {
      return res.status(400).json({ message: "Invalid update request" });
    }
    const note = await Note.findOne({ id, userid }).exec();
    if (!note) {
      return res.status(404).json({ message: `Note with title ${title} not found` });
    }
    const duplicate = await Note.findOne({ userid, title }).lean();
    if (duplicate && duplicate.id.toString() !== id) {
      return res.status(409).json({ message: `Note with title ${title} already exists` });
    }
    note.title = title;
    note.text = text;
    note.completed = completed;
    const updatedNote = await note.save();
    if (updateNote) {
      return res.status(200).json({ message: `${updatedNote.title} updated successfully` });
    }
    return res.status(400).json({ message: "Failed to update note" });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//DELETE /notes
async function deleteNote(req, res, next) {
  try {
    const userid = req.userid;
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Note ID required" });
    }
    const note = await Note.findOne({ _id: id, userid }).exec();
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const result = await note.deleteOne();
    if (result.deletedCount > 0) {
      return res
        .status(200)
        .json({ message: `Note with title ${note.title} with ID ${note._id} deleted successfully` });
    }
    return res.status(400).json({ message: "Failed to delete note" });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

module.exports = { getNotes, createNote, updateNote, deleteNote };
