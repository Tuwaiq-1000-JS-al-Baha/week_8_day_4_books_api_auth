const express = require("express")
const mongoose = require("mongoose")
// const bodyParser = require("body-parser")
require("dotenv").config()
const books = require("./routes/books")
const users = require("./routes/users")

mongoose
  .connect(`mongodb://localhost:27017/testDB`)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(error => {
    console.log(" Error Connected to MongoDB", error)
  })
const app = express()
app.use(express.json())
app.use("/api/books", books)
app.use("/api/auth", users)

app.listen(3000, () => {
  console.log("server is listening on port:" + 3000)
})
