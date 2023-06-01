const rateLimit = require("express-rate-limit");
const allowedOrigins = require("./allowedOrigins");

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  skip: (req, res) => allowedOrigins.includes(req.origin) || !req.origin
});

module.exports = rateLimiter;
