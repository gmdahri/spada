const express = require("express");
const path = require("path");
require("dotenv/config");
const bodyParser = require('body-parser');

const app = express();
const cors = require("cors");
const logger = require('./utils/logger')


const mongoose = require("mongoose");
const env = require("./utils/config")
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("./utils/auth");

const AuthRouter = require('./Router/AuthRouter');
const PermissionRouter = require("./Router/PermissionRouter");
const RoleRouter = require("./Router/RoleRouter");

const url = env.mongoURL;
const connect = mongoose.connect(url);

connect.then(
  () => {
    console.log("connected Correctly");
  },
  (err) => {
    console.error(err);
  }
);
app.use(bodyParser.json());
app.use(cors("*"));
app.use(
  expressSession({
    secret: "auth-session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none", 
      secure: false, 
      maxAge: 30000,
    },
    store: MongoStore.create({
      mongoUrl: env.mongoURL,
      collectionName: "sessions",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // Log the request
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
});
app.use("/api/v1/user/", AuthRouter);
app.use("/api/v1/permission", PermissionRouter)
app.use("/api/v1/role", RoleRouter)

app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = "Route not found";
  next(err);
});

app.use((err, req, res, next) => {
  logger.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "internal server error",
  });
  next();
});

// error handler
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "MongoServerError" && err.code === 11000) {
    status = 400;
    message = "Duplicate key error";
  } else if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  }

  res.status(status).json({
    error: {
      status,
      message,
      success: false,
    },
  });
});

module.exports = app;