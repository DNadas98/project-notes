const jwt = require("jsonwebtoken");
const { logError } = require("../logger");
const { isValidObjectId } = require("mongoose");

function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err || !isValidObjectId(decoded?.UserInfo?.id) || !Array.isArray(decoded?.UserInfo?.roles)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.userid = decoded.UserInfo.id;
      req.roles = decoded.UserInfo.roles;
      next();
    });
  } catch (err) {
    logError(err);
    return res.status(400).json({ message: "Bad request" });
  }
}

module.exports = verifyJWT;
