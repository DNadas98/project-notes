const bannedOrigins = require("..config/bannedOrigins");

function banned(req, res, next) {
  const origin = req.headers.origin;
  if (bannedOrigins.includes(origin)) {
    if (req.accepts("application/json")) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(403).send("Forbidden");
  }
  return next();
}

module.exports = banned;
