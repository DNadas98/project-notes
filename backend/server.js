require("dotenv").config({ path: "backend/config/config.env" });
const express = require("express");
const mongoose = require("mongoose");
const dbConnection = require("./config/dbConnection");
const path = require("path");
const rateLimiter = require("./middleware/rateLimiter");
const helmet = require("helmet");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const { logRequest, logServed, logError } = require("./middleware/logger");
const rootRouter = require("./routes/root.js");
const authRouter = require("./routes/api/auth.js");
/*
const usersRouter = require("./routes/api/users.js");
const notesRouter = require("./routes/api/notes.js");
*/
const adminRouter = require("./routes/api/admin.js");

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

server.use("/public", express.static(path.join(__dirname, "..", "frontend_plainjs", "public")));

//Request logger middleware
server.use(logRequest);

//Routing
server.use("/", rootRouter);
server.use("/auth", authRouter);
/*
server.use("/users", usersRouter);
server.use("/notes", notesRouter);
*/
server.use("/admin", adminRouter);

//404 - Not Found
server.use((req, res, next) => {
  try {
    res.status(404);
    logServed(req, res);
    if (req.accepts("text/html")) {
      res.sendFile(path.join(__dirname, "..", "frontend_plainjs", "views", "404.html"));
    } else if (req.accepts("application/json")) {
      res.json({ "ERROR": "404 Not Found" });
    } else {
      res.send("404 - Not Found");
    }
  } catch (err) {
    logError(err, req);
    next(err);
  }
});

//500 - Internal Server Error
// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  logError(err, req);
  if (req.accepts("text/html")) {
    res.sendFile(path.join(__dirname, "..", "frontend_plainjs", "views", "500.html"));
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
