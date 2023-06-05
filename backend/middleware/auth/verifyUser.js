const { isValidObjectId } = require("mongoose");
const User = require("../../model/schemas/User");
const { logError } = require("../logger");

async function verifyUser(req, res, next) {
  try {
    if (!req?.userid || !isValidObjectId(req.userid) || !req?.roles || !Array.isArray(req.roles)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ _id: req.userid, roles: req.roles }).lean();
    if (!user || !user.active) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return next();
  } catch (err) {
    logError(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = verifyUser;
