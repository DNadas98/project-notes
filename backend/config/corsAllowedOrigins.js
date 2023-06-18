const allowedOrigins = [
  `http://${process.env.IP}:${process.env.PORT}`,
  `http://localhost:${process.env.PORT}`,
  `${process.env.FRONTEND_URI}`
];

module.exports = allowedOrigins;
