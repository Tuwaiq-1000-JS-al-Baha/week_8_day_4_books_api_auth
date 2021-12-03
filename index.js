const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

require("dotenv").config()
const books = require("./routers/books")
const users = require("./routers/users")

mongoose
  .connect(
    `mongodb+srv://lama-2000:${process.env.MONGODB_PASSWORD}@cluster0.hfgau.mongodb.net/books?retryWrites=true&w=majority`
  )

  .then(() => console.log("conect to ManogoDB"))
  .catch(error => console.log("Erorr concting to ManogoDB", error))

const app = express()
app.use(bodyParser.json())
app.use("/api/books", books)
app.use("/api/auth", users)

app.listen(3000, () => console.log("sever is listing", 3000))
