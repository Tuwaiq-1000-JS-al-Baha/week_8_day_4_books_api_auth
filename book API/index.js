const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const books = require("./routes/books")
const users = require("./routes/users")
const { User } = require("./models/User")
const cors = require("cors")

mongoose
  .connect(`mongodb://localhost:27017/testDB`)
  .then(() => console.log(" Connected to MongoDB"))
  .catch(error => console.log("Error connecting to MongoDB", error))

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/books", books)
app.use("/api/auth", users)

app.listen(5000, () => {
  console.log("server is listening on port :" + 5000)
})
