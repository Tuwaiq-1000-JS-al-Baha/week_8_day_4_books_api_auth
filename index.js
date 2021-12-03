const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const books = require("./router/books")
const users = require("./router/users")

mongoose
  .connect(`mongodb://localhost:27017/testDB`)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB ", error)
  })
const app = express()
app.use(express.json())
app.use(cors())
app.use("/api/book", books)
app.use("/api/user", users)
app.listen(5000, () => {
  console.log("server is listening on port:" + 5000)
})
