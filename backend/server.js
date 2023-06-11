require("dotenv").config({ path: "backend/config/config.env" });
const express = require("express");
const mongoose = require("mongoose");
const connectToDatabase = require("./config/dbConnection");
const helmet = require("helmet");
const rateLimiter = require("./middleware/rateLimiter");
const banned = require("./middleware/banned");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const { logRequest, logServed, logError } = require("./middleware/logger");
const authRouter = require("./routes/api/auth.js");
const userRouter = require("./routes/api/user.js");
const notesRouter = require("./routes/api/notes.js");
const adminRouter = require("./routes/api/admin.js");

const server = express();

//Security middleware
server.use(helmet());
server.use(rateLimiter);
server.use(banned);

//CORS
server.use(cors(corsOptions)); //!origin ONLY for developement

//Built-in middleware to handle form data, JSON and static files
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cookieParser());

//Request logger middleware
server.use(logRequest);

//Routing
server.use("/api/auth", authRouter);
server.use("/api/users", userRouter);
server.use("/api/notes", notesRouter);
server.use("/api/admin", adminRouter);

//404 - Not Found
server.use((req, res, next) => {
  try {
    logServed(req, res);
    if (req.accepts("application/json")) {
      res.status(404).json({ message: "Not Found" });
    } else {
      res.status(404).send("Not Found");
    }
  } catch (err) {
    logError(err, req);
    next(err);
  }
});

//500 - Internal Server Error
// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  logError(err, req);
  if (req.accepts("application/json")) {
    res.status(500).json({ message: "Internal Server Error" });
  } else {
    res.status(500).send("Internal Server Error");
  }
});

//Connect to db, start server
connectToDatabase();
mongoose.connection.once("open", () => {
  console.log(`Connected to mongoDB`);
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}\nhttp://127.0.0.1:${process.env.PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  logError(err);
});
