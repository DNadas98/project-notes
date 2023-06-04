const allowedOrigins = require("./corsAllowedOrigins");
const logger = require("../middleware/logger");

const corsOptions = {
  methods: ["GET", "POST", "PATCH", "DELETE"],
  origin: (origin, callback) => {
    //!origin ONLY for developement
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      const err = new Error("Not allowed by CORS");
      logger.logError(err);
      callback(err);
    }
  },
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
