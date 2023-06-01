const mongoose = require("mongoose");
const { logError } = require("../middleware/logger");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN_STR, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  } catch (err) {
    logError(err);
  }
};

module.exports = dbConnection;
