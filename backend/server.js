require("dotenv").config({ path: "backend/config/config.env" });
const express = require("express");
const mongoose = require("mongoose");
const dbConnection = require("./config/dbConnection");
const path = require("path");
const rateLimiter = require("./config/rateLimiter");
const helmet = require("helmet");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const { logRequest, logServed, logError } = require("./middleware/logger");

const server = express();

//Security middleware
server.use(helmet());
server.use(rateLimiter);

//CORS
server.use(cors(corsOptions));

//Built-in middleware to handle form data, JSON and static files
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cookieParser());

server.use("/public", express.static(path.join(__dirname, "..", "frontend", "public")));

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
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
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
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}\nhttp://127.0.0.1:${process.env.PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  logError(err);
});
