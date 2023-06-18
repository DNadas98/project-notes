const { isValidObjectId } = require("mongoose");
const User = require("../../model/schemas/User");
const { logError } = require("../logger");
const bcrypt = require("bcrypt");

async function verifyUser(req, res, next) {
  try {
    if (!req?.userid || !isValidObjectId(req.userid) || !req?.roles || !Array.isArray(req.roles)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findOne({ _id: req.userid, roles: req.roles }).exec();
    if (!user || !user.active) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.refreshToken && user.refreshTokens.length > 0) {
      let isValid = false;
      for (let i = 0; i < user.refreshTokens.length; i++) {
        const matching = await bcrypt.compare(req.refreshToken, user.refreshTokens[i]);
        if (matching) {
          isValid = true;
          break;
        }
      }
      if (!isValid) {
        //detected an already invalidated refresh token --> invalidate all tokens
        user.refreshTokens = [];
        await user.save();
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
    return next();
  } catch (err) {
    logError(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = verifyUser;
