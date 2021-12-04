const express = require("express")
const bodyParser = require("body-parser")
const books = require("./routes/books")
const users = require("./routes/users")
const cors = require("cors")
require("dotenv").config()
const mongoose = require("mongoose")

mongoose
  .connect(`mongodb://localhost:27017/testDB`)
  .then(() => {
    console.log("connected to mongoDB")
  })
  .catch(error => console.log("error connecting to mongoDB", error))

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.use("/api/books", books)
app.use("/api/auth", users)

app.listen(5000, () => {
  console.log("Server is listening on port: " + 5000)
})
