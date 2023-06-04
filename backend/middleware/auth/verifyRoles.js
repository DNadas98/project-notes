const { logError } = require("../logger");

function verifyRoles(req, res, next, allowedRolesArray) {
  try {
    if (!req?.roles) {
      return res.sendStatus(401);
    }
    const result = Boolean(req.roles.some((role) => allowedRolesArray.includes(role)));
    if (!result) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (err) {
    logError(err);
    return res.status(400).json({ message: "Bad request" });
  }
}

module.exports = verifyRoles;
