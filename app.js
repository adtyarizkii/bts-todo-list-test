const express = require("express");
const helmet = require('helmet');
const http = require("http");
const mongoSanitize = require("express-mongo-sanitize");
const routes = require("./routes")
const app = express();
const server = http.createServer(app);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(mongoSanitize());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// v1 api routes
app.use("/api/v1", routes);

module.exports = { app, server };
