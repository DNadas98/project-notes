const jwt = require("jsonwebtoken");
const { logError } = require("../logger");

function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, {
      algorithms: ["HS256"]
    });
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userid = decoded.UserInfo.userid;
    req.roles = decoded.UserInfo.roles;
    return next();
  } catch (err) {
    logError(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = verifyJWT;
