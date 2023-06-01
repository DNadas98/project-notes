const mongoose = require("mongoose");
const { logError } = require("../middleware/logger");

const DB = "projectsdb";
const connectionString = `mongodb://127.0.0.1:27017/${DB}?retryWrites=true`;

const dbConnection = async () => {
  try {
    await mongoose.connect(connectionString, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  } catch (err) {
    console.error(err);
    logError(err);
  }
};

module.exports = dbConnection;
