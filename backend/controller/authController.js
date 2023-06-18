const User = require("../model/schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logError } = require("../middleware/logger");
const { isValidObjectId } = require("mongoose");

//GET /auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const oldRefreshToken = req?.cookies?.jwt;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }
    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser || !foundUser.active || typeof password !== "string") {
      return res.status(401).json({ message: "Wrong username or password" });
    }
    const pwdMatching = await bcrypt.compare(password, foundUser.password);
    if (!pwdMatching) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    if (oldRefreshToken && foundUser.refreshTokens.length > 0) {
      let isValid = false;
      for (let i = 0; i < foundUser.refreshTokens.length; i++) {
        const matching = await bcrypt.compare(oldRefreshToken, foundUser.refreshTokens[i]);
        if (matching) {
          isValid = true;
          foundUser.refreshTokens.splice(i, 1);
          break;
        }
      }
      if (!isValid) {
        //detected an already invalidated refresh token --> invalidate all tokens
        foundUser.refreshTokens = [];
        await foundUser.save();
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    //create accessToken, refreshToken
    const accessToken = jwt.sign(
      { "UserInfo": { "userid": foundUser._id, "roles": foundUser.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRESIN}`, algorithm: "HS256" }
    );
    const newRefreshToken = jwt.sign(
      { "UserInfo": { "userid": foundUser._id, "roles": foundUser.roles } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRESIN}`, algorithm: "HS256" }
    );
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    foundUser.refreshTokens.push(hashedNewRefreshToken);

    const updatedUser = await foundUser.save();
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: process.env.REFRESH_TOKEN_EXPIRESIN
    });

    if (updatedUser) {
      return res
        .status(200)
        .json({ "accessToken": accessToken, "username": foundUser.username, "roles": foundUser.roles });
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    logError(err, req);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

//GET /auth/refresh
async function refresh(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
    const refreshToken = cookies.jwt;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] });
    const userid = decoded?.UserInfo?.userid;
    const roles = decoded?.UserInfo?.roles;

    if (!userid || !roles) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!isValidObjectId(userid) || !Array.isArray(roles)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const foundUser = await User.findOne({ _id: userid, roles }).lean();
    if (!foundUser || !foundUser.active || !foundUser?.refreshTokens?.length >= 1) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let isValid = false;
    for (let i = 0; i < foundUser.refreshTokens.length; i++) {
      const matching = await bcrypt.compare(refreshToken, foundUser.refreshTokens[i]);
      if (matching) {
        isValid = true;
        break;
      }
    }
    if (!isValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign(
      { "UserInfo": { "userid": foundUser._id, "roles": foundUser.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRESIN}`, algorithm: "HS256" }
    );

    return res
      .status(200)
      .json({ "accessToken": accessToken, "username": foundUser.username, "roles": foundUser.roles });
  } catch (err) {
    logError(err, req);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

//GET /auth/logout
async function logout(req, res) {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies?.jwt;

    if (!refreshToken) {
      return res.status(204).json({ message: "No content" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] });
    const userid = decoded?.UserInfo?.userid;
    if (isValidObjectId(userid)) {
      const foundUser = await User.findById(userid).exec();
      if (foundUser) {
        for (let i = 0; i < foundUser.refreshTokens.length; i++) {
          const matching = await bcrypt.compare(refreshToken, foundUser.refreshTokens[i]);
          if (matching) {
            foundUser.refreshTokens.splice(i, 1);
            await foundUser.save();
            break;
          }
        }
      }
    }

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    logError(err, req);
    return res.status(400).json({ message: "Invalid request" });
  }
}

//GET /auth/validate
function validateAccess(req, res) {
  try {
    return res.status(200).json({ message: "OK" });
  } catch (err) {
    logError(err, req);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { login, refresh, logout, validateAccess };
