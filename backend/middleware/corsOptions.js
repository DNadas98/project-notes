const allowedOrigins = require("../config/corsAllowedOrigins");
const { logError } = require("./logger");

const corsOptions = {
  methods: ["GET", "POST", "PATCH", "DELETE"],
  origin: (origin, callback) => {
    //!origin ONLY for developement
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      const err = new Error("Not allowed by CORS");
      err.status = 403;
      logError(err);
      callback(err);
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};

module.exports = corsOptions;
