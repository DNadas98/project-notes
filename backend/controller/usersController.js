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
    res.json(users);
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//POST /users
async function createUser(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: `Username ${username} already exists` });
    }
    const hashedPwd = await bcrypt.hash(password, 10); //10 salt rounds
    const userObject = { "username": username, "password": hashedPwd, "roles": ["User"] };
    const user = await User.create(userObject);
    if (user) {
      res.status(201).json({ message: `New user ${username} created successfully` });
    } else {
      res.status(400).json({ message: "Failed to create new user" });
    }
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//PATCH /users
async function updateUser(req, res, next) {
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
    res.json({ message: `${updatedUser.username} updated successfully` });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//DELETE /users
async function deleteUser(req, res, next) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User ID required" });
    }
    const notes = await Note.findOne({ user: id }).lean().exec();
    if (notes?.length) {
      return res.status(400).json({ message: "User has assigned notes!" });
    }
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const result = await user.deleteOne();
    res.json({ message: `User named ${result.username} with ID ${result._id} deleted successfully` });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
