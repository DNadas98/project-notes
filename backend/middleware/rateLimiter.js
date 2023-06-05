const rateLimit = require("express-rate-limit");
const allowedOrigins = require("../config/corsAllowedOrigins");
const { logError } = require("./logger");

const rateLimiter = rateLimit({
  windowMs: process.env.LIMITER_MS,
  max: process.env.LIMITER_MAX,
  message: { message: "Too many requests from this IP" },
  handler: (req, res, next, options) => {
    logError(options, req);
    const err = new Error({ message: "Too many requests from this IP" });
    next(err);
  },
  // eslint-disable-next-line no-unused-vars
  skip: (req, res) => allowedOrigins.includes(req.origin) || !req.origin,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = rateLimiter;
