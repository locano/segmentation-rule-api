
// Create Express API
const express = require("express");
const cors = require("cors");
// Connect to MongoDB
const connectDB = require("./src/db/mongoose");


// Adding Routes
const catalogueRouter = require("./src/routes/catalogue");
const treeRouter = require("./src/routes/tree");
// Middlewares
const send404 = require("./src/middleware/error404");
const catchAllErrors = require("./src/middleware/catchAllErrors");

require("dotenv").config();
const app = express();
app.use(express.json());
const port = process.env.API_PORT;

// Connect to DB
connectDB();

// CORS
app.use(cors({ origin: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});


app.get("/", (req, res) => {
  res.send("API its working");
});

app.use(catalogueRouter);
app.use(treeRouter);
app.use(send404);
app.use(catchAllErrors);


app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// Export the Express API
module.exports = app;