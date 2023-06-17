const User = require("../model/schemas/User");
const Note = require("../model/schemas/Note");
const { logError } = require("../middleware/logger");
const { isValidObjectId } = require("mongoose");
const availableRoles = require("../config/availableRoles");

//GET /users
async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().select("-password  -refreshTokens -__v").lean();
    if (!users || !Array.isArray(users) || !users.length >= 1) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ "data": users });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//GET /users/:id
async function getUserById(req, res, next) {
  try {
    const _id = decodeURI(req.params.id);
    if (!isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    const user = await User.findById(_id).select("-password -refreshTokens -__v").lean();
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    return res.status(200).json({ "data": user });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//PATCH /users
async function updateUserById(req, res, next) {
  try {
    const { userid, roles, active } = req.body;
    if (!roles && typeof active !== "boolean") {
      return res.status(204).json({ message: "Nothing to update" });
    }
    if (
      !userid ||
      !isValidObjectId(userid) ||
      (roles && !Array.isArray(roles)) ||
      (roles && !roles.includes("User")) ||
      (roles && roles.some((role) => !availableRoles.includes(role)))
    ) {
      return res.status(400).json({ message: "Invalid user details" });
    }
    const user = await User.findById(userid).exec();
    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }
    if (user.roles.includes("Admin")) {
      return res.status(400).json({ message: "Admin accounts can not be modified here" });
    }
    if (roles) {
      user.roles = roles;
    }
    if (typeof active === "boolean") {
      user.active = active;
    }
    const updatedUser = await user.save();
    if (updatedUser) {
      return res.status(200).json({ message: `User updated successfully` });
    }
    return res.status(400).json({ message: "Failed to update user" });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//DELETE /users
async function deleteUserById(req, res, next) {
  try {
    const { userid } = req.body;
    if (!userid) {
      return res.status(400).json({ message: "User ID required" });
    }
    if (!isValidObjectId(userid)) {
      return res.status(400).json({ message: "Invalid user details" });
    }
    const user = await User.findById(userid).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.roles.includes("Admin")) {
      return res.status(400).json({ message: "Admin accounts can not be deleted here" });
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
    return next(err);
  }
}

module.exports = { getAllUsers, getUserById, updateUserById, deleteUserById };
