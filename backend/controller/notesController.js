const Note = require("../model/schemas/Note");
const { logError } = require("../middleware/logger");
const { isValidObjectId } = require("mongoose");

//GET /notes
async function getNotes(req, res, next) {
  try {
    const userid = req.userid;
    if (!userid) {
      //!!!!!!!!!!!!!!!!
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!isValidObjectId(userid)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const notes = await Note.find({ userid }).lean();
    if (!notes || !Array.isArray(notes) || !notes.length >= 1) {
      return res.status(404).json({ message: "No notes found" });
    }
    res.status(200).json(notes);
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//POST /notes
async function createNote(req, res, next) {
  try {
    const userid = req.userid;
    if (!userid) {
      //!!!!!!!!!!!!!!!!
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, text } = req.body;
    if (!title || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const duplicate = await Note.findOne({ userid, title });
    if (duplicate) {
      return res.status(409).json({ message: `Note with title ${title} already exists` });
    }
    const noteObject = { "userid": userid, "title": title, "text": text };
    const note = await Note.create(noteObject);
    if (note) {
      res.status(201).json({ message: `New note ${title} created successfully` });
    } else {
      res.status(400).json({ message: "Failed to create new note" });
    }
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//PATCH /notes
async function updateNote(req, res, next) {
  try {
    const userid = req.userid;
    if (!userid) {
      //!!!!!!!!!!!!!!!!
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id, title, text, completed } = req.body;
    if (!id || !title || !text || typeof completed != "boolean") {
      return res.status(400).json({ message: "Invalid update request" });
    }
    const note = await Note.findOne({ id, userid }).exec();
    if (!note) {
      return res.status(404).json({ message: `Note with title ${title} not found` });
    }
    const duplicate = await Note.findOne({ userid, title });
    if (duplicate && duplicate.id.toString() !== id) {
      console.log(duplicate);
      return res.status(409).json({ message: `Note with title ${title} already exists` });
    }
    note.title = title;
    note.text = text;
    note.completed = completed;
    const updatedNote = await note.save();
    res.status(200).json({ message: `${updatedNote.title} updated successfully` });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//DELETE /notes
async function deleteNote(req, res, next) {
  try {
    const userid = req.userid;
    if (!userid) {
      //!!!!!!!!!!!!!!!!
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Note ID required" });
    }
    console.log(id, userid);
    const note = await Note.findOne({ _id: id, userid }).exec();
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const result = await note.deleteOne();
    res.status(200).json({ message: `Note with title ${note.title} with ID ${note._id} deleted successfully` });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

module.exports = { getNotes, createNote, updateNote, deleteNote };