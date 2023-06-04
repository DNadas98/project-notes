const User = require("../model/schemas/User");
const Note = require("../model/schemas/Note");
const { logError } = require("../middleware/logger");
const bcrypt = require("bcrypt");

//GET /user
async function getUserData(req, res, next) {
  try {
    const user = await User.findById(req.userid).select("-_id -password -active -__v").lean().exec();
    if (!user) {
      //!!!!!!!!!!!!!!!!
      return res.status(400).json({ message: `User not found` });
    }
    res.status(200).json(user);
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//POST /user
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

//PATCH /user
async function updateUser(req, res, next) {
  try {
    const { newUsername, newPassword } = req.body;
    const id = req.userid;

    if (!newUsername && !newPassword) {
      return res.status(400).json({ message: "Nothing to change" });
    }
    const user = await User.findById(id).exec();
    console.log(id);
    if (!user) {
      //!!!!!!!!!!!!!!!!
      return res.status(404).json({ message: `User not found` });
    }
    if (newUsername) {
      const duplicate = await User.findOne({ newUsername }).lean().exec();
      if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: `Username ${newUsername} already exists` });
      }
      user.username = newUsername;
    }
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }
    console.log(user);
    const updatedUser = await user.save();
    res.status(200).json({ message: `${updatedUser.username} updated successfully` });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

//DELETE /users
async function deleteUser(req, res, next) {
  try {
    const id = req.userid;
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }
    const note = await Note.findOne({ userid: id }).lean().exec();
    if (note) {
      await Note.deleteMany({ userid: id });
    }
    const result = await User.deleteOne(id);
    console.log(user, result);
    res.status(200).json({ message: `User named ${result.username} with ID ${result._id} deleted successfully` });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

module.exports = { getUserData, createUser, updateUser, deleteUser };