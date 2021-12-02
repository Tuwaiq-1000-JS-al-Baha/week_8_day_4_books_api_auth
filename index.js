const express = require("express")
const bodyParser = require("body-parser")
const books = require("./routes/books")
const mongoose = require("mongoose")
require("dotenv").config()
const users = require("./routes/users")

mongoose
  .connect(
    `mongodb+srv://x:${process.env.MONGODB_PASSWORD}@cluster0.f0wz6.mongodb.net/BooksDB?authSource=admin&replicaSet=atlas-rzbbpe-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`
  )
  .then(() => console.log("connected to MongoDB"))
  .catch(error => console.log("Error connecting to MongoDB", error.message))

const app = express()
app.use(bodyParser.json())
app.use("/api/books", books)
app.use("/api/auth", users)

// console.log(process.env.MONGODB_PASSWORD)
app.listen(3000, () => {
  console.log("book app listening at http://localhost:" + 3000)
})
