const rateLimit = require("express-rate-limit");
const allowedOrigins = require("../../config/corsAllowedOrigins");
const { logError } = require("../logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  handler: (req, res, next, options) => {
    logError(options, req);
    return res.status(429).json({ message: "Too many login attempts, try again after 1 minute" });
  },
  // eslint-disable-next-line no-unused-vars
  skip: (req, res) => allowedOrigins.includes(req.origin) || !req.origin,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = loginLimiter;
