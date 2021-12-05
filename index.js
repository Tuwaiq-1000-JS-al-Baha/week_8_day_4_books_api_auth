const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const books = require("./routes/books")
const users = require("./routes/users")
require("dotenv/config")

mongoose
  .connect(
    `mongodb+srv://najmah:${process.env.MONGODB_PASSWORD}@cluster0.npdui.mongodb.net/testDB?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connecting to MongoDB"))
  .catch(error => console.log("Erroe connecting to MongoDB", error.message))

console.log(process.env.MONGODB_PASSWORD)

const app = express()

app.use(bodyParser.json())
app.use("/api/books", books)
app.use("/app/auth")

app.listen(3000, () => {
  console.log("server is listening on port:" + 3000)
})
