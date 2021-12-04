const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const books = require("./routes/books")
const users = require("./routes/users")

mongoose
  .connect(`mongodb+srv://Abdulathim:${process.env.MONGODB_PASSWORD}@cluster0.asekp.mongodb.net/testDB`)

  .then(() => {
    console.log("connect to MongoDB")
  })
  .catch(error => {
    console.log("error connecting to MongoDB", error)
  })

const app = express()
app.use(express.json())

app.use("/api/books", books)
app.use("/api/auth", users)

app.listen(3000, () => {
  console.log("server is listening on port :" + 3000)
})
