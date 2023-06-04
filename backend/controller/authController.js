const User = require("../model/schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logError } = require("../middleware/logger");

//GET /auth/login
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser || !foundUser.active || typeof password !== "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const pwdMatching = await bcrypt.compare(password, foundUser.password);
    if (!pwdMatching) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //create accesstoken, refreshtoken
    const accessToken = jwt.sign(
      { "UserInfo": { "userid": foundUser._id, "roles": foundUser.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRESIN}` }
    );
    const refreshToken = jwt.sign(
      { "UserInfo": { "userid": foundUser._id, "roles": foundUser.roles } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRESIN}` }
    );
    //create cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //only accessible by webserver
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: process.env.REFRESH_TOKEN_EXPIRESIN
    });
    //client app never handles refresh token, only the server
    return res.status(200).json({ accessToken });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

//GET /auth/refresh
async function refresh(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
    const refreshToken = cookies.jwt;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded?.UserInfo?.userid || !decoded?.UserInfo?.roles) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const foundUser = await User.findById(decoded.UserInfo.userid).lean();
    if (!foundUser || !foundUser.active) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = jwt.sign(
      { "UserInfo": { "userid": foundUser._id, "roles": foundUser.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRESIN}` }
    );
    return res.status(200).json(accessToken);
  } catch (err) {
    logError(err, req);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

//GET /auth/logout
function logout(req, res, next) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(204).json({ message: "No content" });
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    logError(err, req);
    return next(err);
  }
}

module.exports = { login, refresh, logout };
