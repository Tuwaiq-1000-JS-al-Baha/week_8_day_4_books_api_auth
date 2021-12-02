const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
require("dotenv").config()
const books = require("./routes/books")
const users = require("./routes/users")

const app = express()
app.use(bodyParser.json())

mongoose
  .connect(
    `mongodb+srv://amjadill:${process.env.MONGODB_PASSWORD}@cluster0.j6bza.mongodb.net/day4Database?retryWrites=true&w=majority`
  )
  .then(() => console.log("connected to database"))
  .catch(error => console.log("ERROR", error))

app.use("/api/books", books)
app.use("/api/users", users)

app.listen(3000, () => {
  console.log("port is listening now!", 3000)
})
