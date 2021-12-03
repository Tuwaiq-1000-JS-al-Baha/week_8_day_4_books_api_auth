const express = require("express")
const books = require("./routes/books")
const users = require("./routes/users")
const mongoose = require("mongoose")
require("dotenv").config()

mongoose
  .connect(`mongodb://localhost:27017/testDB`)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB, error")
  })

console.log(process.env.MONGODB_PASSWORD)

const app = express()
app.use(express.json())
app.use("/api/books", books)
app.use("/api/auth", users)

app.listen(3000, () => {
  console.log("server is listening on port:" + 3000)
})
