const User = require("../model/schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logError } = require("../middleware/logger");

async function login(req, res, next) {
  try {
    //
    res.json({ message: "login" });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    //
    res.json({ message: "refresh" });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}
async function logout(req, res, next) {
  try {
    //
    res.json({ message: "logout" });
  } catch (err) {
    logError(err, req);
    next(err);
  }
}

module.exports = { login, refresh, logout };
