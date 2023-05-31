const rateLimit = require("express-rate-limit");

const skipSameOrigin = (req) => {
  return req.headers.origin === req.headers.referer;
};

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  skip: skipSameOrigin
});

module.exports = rateLimiter;
