const express = require("express")
const bodyParser = require("body-parser")
const cors=require("cors")
const books = require("./routes/books")
const mongoose = require("mongoose")
require("dotenv").config()
const users = require("./routes/users")


mongoose
  // .connect(`mongodb+srv://shahadgh:${process.env.MONOGDB_PASSWORD}@cluster0.nbouy.mongodb.net/testDB`)
  .connect(` mongodb://localhost:27017/testDB`)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch(error => {
    console.log("Error conneceting to MongoDB", error)
  })

const app = express()

app.use(bodyParser.json())

app.use("/api/books", books)
app.use("/api/auth", users)
app.use(cors())


app.listen(5000, () => {
  console.log("server is listening on port :" + 5000)
})