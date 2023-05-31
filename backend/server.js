const express = require("express");
const path = require("path");
const rateLimiter = require("./config/rateLimiter");
const helmet = require("helmet");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const logger = require("./middleware/logger");

const server = express();
const PORT = 3001;

//Security middleware
server.use(helmet());
server.use(rateLimiter);

//CORS
server.use(cors(corsOptions));

//Built-in middleware to handle form data, JSON and static files
//server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(path.join(__dirname, "..", "frontend", "public")));

//Request logger middleware
server.use(logger.logRequest);

//Routing
server.use("/", require("./routes/root.js"));

//Package API
server.use("/packages", require("./routes/api/packages.js"));
server.use("/status", require("./routes/api/status.js"));

//test error
server.use("/error", (req, res, next) => {
  res.setHeader("Accepts", "text/html");
  try {
    throw new Error({ "ERROR": "Test error" });
  } catch (err) {
    next(err);
  }
});

//500
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  logger.logError(err, req);
  if (req.accepts("text/html")) {
    res.sendFile(path.join(__dirname, "..", "frontend", "views", "500.html"));
  } else if (req.accepts("application/json")) {
    res.json({ "ERROR": "500 Internal Server Error" });
  } else {
    res.send("500 - Internal Server Error");
  }
});

//404
server.use((req, res) => {
  res.status(404);
  logger.logServed(req, res);
  if (req.accepts("text/html")) {
    res.sendFile(path.join(__dirname, "..", "frontend", "views", "404.html"));
  } else if (req.accepts("application/json")) {
    res.json({ "ERROR": "404 Not Found" });
  } else {
    res.send("404 - Not Found");
  }
});

//Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}\nhttp://127.0.0.1:${PORT}`);
});
