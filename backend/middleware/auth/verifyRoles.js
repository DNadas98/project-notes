const { logError } = require("../logger");

function verifyRoles(req, res, next, allowedRolesArray) {
  try {
    if (!req?.roles) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const allowed = Boolean(req.roles.some((role) => allowedRolesArray.includes(role)));
    if (!allowed) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return next();
  } catch (err) {
    logError(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = verifyRoles;
