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
    return res.status(200).json(users);
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//PATCH /users
async function updateUserById(req, res, next) {
  try {
    const { userid, username, password, roles, active } = req.body;
    if (!userid || !username || !password || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findById(userid).exec();
    if (!user) {
      return res.status(404).json({ message: `User ${username} not found` });
    }
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== userid) {
      return res.status(409).json({ message: `Username ${username} already exists` });
    }
    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save();
    if (updatedUser) {
      return res.status(200).json({ message: `User with ID ${updatedUser._id} updated successfully` });
    }
    return res.status(400).json({ message: "Failed to update user" });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//DELETE /users
async function deleteUserById(req, res, next) {
  try {
    const { id: userid } = req.body;
    if (!userid) {
      return res.status(400).json({ message: "User ID required" });
    }
    const user = await User.findById(userid).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const note = await Note.findOne({ userid }).lean().exec();
    if (note) {
      await Note.deleteMany({ userid });
    }
    const result = await User.deleteOne({ _id: userid });
    if (result.deletedCount > 0) {
      return res.status(200).json({ message: `User with ID ${user._id} deleted successfully` });
    }
    return res.status(400).json({ message: "Failed to delete user" });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

module.exports = { getAllUsers, updateUserById, deleteUserById };
