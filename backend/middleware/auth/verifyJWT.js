const jwt = require("jsonwebtoken");
const { logError } = require("../logger");

function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const accessToken = authHeader?.split(" ")[1];
    const refreshToken = req?.cookies?.jwt;
    if (!authHeader?.startsWith("Bearer") || !accessToken || !refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessDecoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, {
      algorithms: ["HS256"]
    });
    const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
      algorithms: ["HS256"]
    });
    if (
      !accessDecoded?.UserInfo?.userid ||
      !accessDecoded?.UserInfo?.roles ||
      !refreshDecoded?.UserInfo?.userid ||
      !refreshDecoded?.UserInfo?.roles ||
      accessDecoded.UserInfo.userid !== refreshDecoded.UserInfo.userid
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userid = accessDecoded.UserInfo.userid;
    req.roles = accessDecoded.UserInfo.roles;
    req.refreshToken = refreshToken;
    return next();
  } catch (err) {
    logError(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = verifyJWT;
