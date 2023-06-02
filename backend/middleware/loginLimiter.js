const rateLimit = require("express-rate-limit");
const allowedOrigins = require("../config/allowedOrigins");
const { logError } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts from this IP, try again after 1 minute" },
  handler: (req, res, next, options) => {
    logError(options, req);
    const err = new Error({ message: "Too many login attempts from this IP, try again after 1 minute" });
    next(err);
  },
  skip: (req, res) => allowedOrigins.includes(req.origin) || !req.origin,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = loginLimiter;
