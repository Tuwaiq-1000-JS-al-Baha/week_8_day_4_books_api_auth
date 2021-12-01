const express = require("express")
const bodyParser = require("body-parser")
const books = require("./routes/books")
const mongoose = require("mongoose")
const users = require("./routes/users")
require("dotenv").config()
const app = express()
mongoose
  .connect(`mongodb+srv://mosab100:${process.env.MONGODB_PASSWORD1}@cluster0.javil.mongodb.net/testDB`)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch(error => {
    console.log("Error connecting", error)
  })

console.log(process.env.MONGODB_PASSWORD)
app.use(bodyParser.json())

app.use("/api/books", books)
app.use("/api/auth" , users)



app.listen(3000, () => {
  console.log("server is listen you " + 3000)
})
