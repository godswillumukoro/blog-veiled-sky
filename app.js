require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDatabase = require("./server/config/database");

const app = express();

// Mongoose connection
connectDatabase();

// pass data through forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static folder
app.use(express.static("public"));

// template engine
app.use(expressLayout);
app.set("layout", "./layouts/indexLayout");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/indexRoute"));

app.listen(process.env.PORT, () =>
  console.log("Running on port: " + process.env.PORT)
);
