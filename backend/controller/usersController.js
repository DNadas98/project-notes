const User = require("../model/schemas/User");
const Note = require("../model/schemas/Note");
const { logError } = require("../middleware/logger");
const bcrypt = require("bcrypt");

//GET /user
async function getUserData(req, res, next) {
  try {
    const userid = req.userid;
    const user = await User.findById(userid).select("-_id -password -active").lean();
    if (!user) {
      console.warn("verifyJWT failed at getUserData");
      return res.status(400).json({ message: `User not found` });
    }
    return res.status(200).json(user);
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//POST /user
async function createUser(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const duplicate = await User.findOne({ username }).lean();
    if (duplicate) {
      return res.status(409).json({ message: `Username ${username} already exists` });
    }
    const hashedPwd = await bcrypt.hash(password, 10); //10 salt rounds
    const userObject = { "username": username, "password": hashedPwd, "roles": ["User"] };
    const user = await User.create(userObject).lean();
    if (user) {
      return res.status(201).json({ message: `New user ${username} created successfully` });
    }
    return res.status(400).json({ message: "Failed to create new user" });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//PATCH /user
async function updateUser(req, res, next) {
  try {
    const { newUsername, newPassword } = req.body;
    const userid = req.userid;
    if (!newUsername && !newPassword) {
      return res.status(400).json({ message: "Nothing to change" });
    }
    const user = await User.findById(userid).exec();
    if (!user) {
      console.warn("verifyJWT failed at updateUser");
      return res.status(404).json({ message: `User not found` });
    }
    if (newUsername) {
      const duplicate = await User.findOne({ newUsername }).lean();
      if (duplicate && duplicate?._id.toString() !== userid) {
        return res.status(409).json({ message: `Username ${newUsername} already exists` });
      }
      user.username = newUsername;
    }
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await user.save();
    if (updatedUser) {
      return res.status(200).json({ message: `${updatedUser.username} updated successfully` });
    }
    return res.status(400).json({ message: "Failed to update user" });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//DELETE /users
async function deleteUser(req, res, next) {
  try {
    const userid = req.userid;
    const user = await User.findById(userid).exec();
    if (!user) {
      console.warn("verifyJWT failed at deleteUser");
      return res.status(404).json({ message: `User not found` });
    }
    const note = await Note.findOne({ userid }).lean();
    if (note) {
      await Note.deleteMany({ userid });
    }
    const result = await user.deleteOne();
    if (result.deletedCount > 0) {
      return res.status(200).json({ message: `User named ${user.username} with ID ${user._id} deleted successfully` });
    }
    return res.status(400).json({ message: "Failed to delete user" });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

module.exports = { getUserData, createUser, updateUser, deleteUser };
