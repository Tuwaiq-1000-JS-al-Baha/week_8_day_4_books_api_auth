const express = require("express")
const books = require("./routes/books")

const users = require("./routes/users")
const mongoose = require("mongoose")
require("dotenv").config()

//------------------------------عشان نسوي كونكتيدمع عشان نرط الاي بي الي والداتا بيس -------------//
mongoose
  .connect(`mongodb://localhost:27017/testDB`)
  .then(() => {
    console.log("Connected to MONGODB")
  })
  .catch(error => {
    console.log("Error connecting to MONGODB", error)
  })

//////-------------------------------------------------------------------------------------------------------------
console.log(process.env.MONGODB_PASSWORD1)
const app = express()

app.use(express.json())

app.use("/api/books", books)

app.use("/api/auth", users)

app.listen(5000, () => {
  console.log("server is listen on port" + 5000)
})
