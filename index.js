const express = require("express")
const bodyParser = require("body-parser")
const books = require("./routes/books")
const users = require("./routes/users")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()
mongoose
  .connect(`mongodb://localhost:27017/testDB`)
  .then(() => {
    console.log("Connected to MangoDB")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB", error)
  })

console.log(process.env.MONGODB_PASSWORD)
app.use(bodyParser.json())
app.use("/api/books", books)
app.use("/api/auth", users)
app.listen(3000, () => {
  console.log("server is listenin on port:" + 3000)
})
