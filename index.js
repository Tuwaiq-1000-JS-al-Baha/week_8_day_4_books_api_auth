const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const books = require("./routes/books")
const users = require("./routes/users")
const cors = require("cors")

mongoose
  .connect(`mongodb+srv://Latifah000:${process.env.MONGODB_PASSWORD}@cluster0.ahz0n.mongodb.net/bookDB`)
  .then(() => {
    console.log("conncted MongoDB")
  })
  .catch(error => {
    console.log("Error to conncted MongoDB", error)
  })
const app = express()
app.use(express.json())
app.use("/api/books", books)
app.use("/api/auth", users)
app.use(cors())
app.listen(5001, () => {
  console.log("server is listening on port: " + 5001)
})
