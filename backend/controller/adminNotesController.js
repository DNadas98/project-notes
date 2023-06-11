const Note = require("../model/schemas/Note");
const { logError } = require("../middleware/logger");
const { isValidObjectId } = require("mongoose");

//GET /notes
async function getNotesOfUser(req, res, next) {
  try {
    const { userid } = req.body;
    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!isValidObjectId(userid)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
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

//GET /notes/all
async function getAllNotes(req, res, next) {
  try {
    const notes = await Note.find().lean();
    if (!notes || !Array.isArray(notes) || !notes.length >= 1) {
      return res.status(404).json({ message: "No notes found" });
    }
    return res.status(200).json(notes);
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//POST /notes
async function createNote(req, res, next) {
  try {
    const { userid, title, text } = req.body;
    if (!userid || !title || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const duplicate = await Note.findOne({ userid, title }).lean().exec();
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
    const { id, userid, title, text, completed } = req.body;
    if (!id || !userid || !title || !text || !completed || typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid update request" });
    }
    const note = await Note.findById(id).exec();
    if (!note) {
      return res.status(404).json({ message: `Note ${title} not found` });
    }
    const duplicate = await Note.findOne({ userid, title }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
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
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Note ID required" });
    }
    const note = await Note.findById(id).exec();
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

module.exports = { getNotesOfUser, getAllNotes, createNote, updateNote, deleteNote };
