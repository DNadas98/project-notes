const mongoose = require("mongoose");
const connectionString = "mongodb://127.0.0.1:27017/projectsdb?retryWrites=true&w=majority";

const dbConnection = async () => {
  try {
    await mongoose.connect(connectionString, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = dbConnection;
