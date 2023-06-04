require("dotenv").config({ path: "backend/config/config.env" });
const express = require("express");
const mongoose = require("mongoose");
const dbConnection = require("./config/dbConnection");
const rateLimiter = require("./middleware/rateLimiter");
const helmet = require("helmet");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const { logRequest, logServed, logError } = require("./middleware/logger");
const verifyJWT = require("./middleware/auth/verifyJWT");
const verifyUser = require("./middleware/auth/verifyUser");
const verifyRoles = require("./middleware/auth/verifyRoles");
const authRouter = require("./routes/api/auth.js");
const userRouter = require("./routes/api/user.js");
const notesRouter = require("./routes/api/notes.js");
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

//Request logger middleware
server.use(logRequest);

//Routing
server.use("/auth", authRouter);
server.use("/users", userRouter);
server.use("/notes", verifyJWT, verifyUser, notesRouter);
server.use("/admin", verifyJWT, verifyUser, (req, res, next) => verifyRoles(req, res, next, ["Admin"]), adminRouter);

//404 - Not Found
server.use((req, res, next) => {
  try {
    logServed(req, res);
    if (req.accepts("application/json")) {
      res.status(404).json({ message: "404 - Not Found" });
    } else {
      res.status(404).send("404 - Not Found");
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
    res.status(500).json({ message: "500 - Internal Server Error" });
  } else {
    res.status(500).send("500 - Internal Server Error");
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
