const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const books = require("./routes/books");
const users = require("./routes/users");

mongoose
  .connect(`mongodb://localhost:27017/testDB`)
  .then(() => {
    console.log("Connect to mongoDB");
  })
  .catch((error) => {
    console.log("error connecting to mongoDB", error);
  });

const app = express();
console.log(process.env.MONGODB_PASSWORD);

app.use(express.json());
app.use("/api/books", books);
app.use("/api/auth", users);
app.use(cors());

app.listen(5000, () => {
  console.log("server is listening on port:" + 5000);
});
