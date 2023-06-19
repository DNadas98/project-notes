const Note = require("../model/schemas/Note");
const { logError } = require("../middleware/logger");
const { isValidObjectId } = require("mongoose");

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

//GET /notes/:id
async function getNoteById(req, res, next) {
  try {
    const userid = req.userid;
    const _id = decodeURI(req.params.id);
    if (!isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid note data" });
    }
    const note = await Note.findOne({ _id, userid }).lean();
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ "data": note });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//POST /notes
async function createNote(req, res, next) {
  try {
    const userid = req.userid;
    const { title, text, completed } = req.body;
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid note data" });
    }
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const duplicate = await Note.findOne({ userid, title }).lean();
    if (duplicate) {
      return res.status(409).json({ message: `Note with title ${title} already exists` });
    }
    const noteObject = { "userid": userid, "title": title, "text": text ? text : "", "completed": completed };
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
    const { _id, title, text, completed } = req.body;
    if (!_id || typeof completed != "boolean") {
      return res.status(400).json({ message: "Invalid note data" });
    }
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const note = await Note.findOne({ _id, userid }).exec();
    if (!note) {
      return res.status(404).json({ message: `Note with title ${title} not found` });
    }
    const duplicate = await Note.findOne({ userid, title }).lean();
    if (duplicate && duplicate._id.toString() !== _id) {
      return res.status(409).json({ message: `Note with title ${title} already exists` });
    }
    note.title = title;
    note.text = text ? text : "";
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
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Note ID required" });
    }
    const note = await Note.findOne({ _id, userid }).exec();
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const result = await note.deleteOne();
    if (result) {
      return res.status(200).json({ message: `Note with title ${note.title} deleted successfully` });
    }
    return res.status(400).json({ message: "Failed to delete note" });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };
