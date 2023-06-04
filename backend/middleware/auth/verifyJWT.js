const jwt = require("jsonwebtoken");
const { logError } = require("../logger");

function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    });
  } catch (err) {
    logError(err);
    return res.status(400).json({ message: "Bad request" });
  }
}

module.exports = verifyJWT;
