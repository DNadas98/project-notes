const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dbConnection = require("./config/dbConnection");
const path = require("path");
const rateLimiter = require("./config/rateLimiter");
const helmet = require("helmet");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logRequest, logServed, logError } = require("./middleware/logger");

const server = express();
const PORT = process.env.PORT || 3000;

//Security middleware
server.use(helmet());
server.use(rateLimiter);

//CORS
server.use(cors(corsOptions));

//Built-in middleware to handle form data, JSON and static files
server.use(cookieParser);
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(express.static(path.join(__dirname, "..", "frontend", "public")));

//Request logger middleware
server.use(logRequest);

//Routing
server.use("/", require("./routes/root.js"));

//test error
server.use("/error", (req, res, next) => {
  try {
    throw new Error("Test error");
  } catch (err) {
    next(err);
  }
});

//404 - Not Found
server.use((req, res, next) => {
  res.status(404);
  logServed(req, res);
  if (req.accepts("text/html")) {
    res.sendFile(path.join(__dirname, "..", "frontend", "views", "404.html"));
  } else if (req.accepts("application/json")) {
    res.json({ "ERROR": "404 Not Found" });
  } else {
    res.send("404 - Not Found");
  }
});

//500 - Internal Server Error
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  logError(err, req);
  if (req.accepts("text/html")) {
    res.sendFile(path.join(__dirname, "..", "frontend", "views", "500.html"));
  } else if (req.accepts("application/json")) {
    res.json({ "ERROR": "500 Internal Server Error" });
  } else {
    res.send("500 - Internal Server Error");
  }
});

//Start db, server
dbConnection();
mongoose.connection.once("open", () => {
  console.log(`Connected to mongoDB`);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}\nhttp://127.0.0.1:${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  logError(err);
});
