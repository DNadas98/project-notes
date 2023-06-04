const User = require("../model/schemas/User");
const Note = require("../model/schemas/Note");
const { logError } = require("../middleware/logger");
const bcrypt = require("bcrypt");

//GET /users
async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").lean();
    if (!users || !Array.isArray(users) || !users.length >= 1) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//PATCH /users
async function updateUserById(req, res, next) {
  try {
    const { id, username, password, roles, active } = req.body;
    if (!id || !username || !password || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ message: `User ${username} not found` });
    }
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: `Username ${username} already exists` });
    }
    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save();
    res.status(200).json({ message: `${updatedUser.username} updated successfully` });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//DELETE /users
async function deleteUserById(req, res, next) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User ID required" });
    }
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const note = await Note.findOne({ userid: id }).lean().exec();
    if (note) {
      await Note.deleteMany({ userid: id });
    }
    const result = await user.deleteOne();
    res.status(200).json({ message: `User named ${result.username} with ID ${result._id} deleted successfully` });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

module.exports = { getAllUsers, updateUserById, deleteUserById };
