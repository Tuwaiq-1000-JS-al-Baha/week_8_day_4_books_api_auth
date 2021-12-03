const express = require("express")
require("dotenv").config()
const cors = require("cors")
const mongoose = require ("mongoose")
const bodyParser = require("body-parser")
const users = require("./routes/users")
const books = require("./routes/books")

//conect mongoose
mongoose
  .connect(`mongodb://localhost:27017/testDB`)// رابط الربط ببين DB &API
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB ", error)
  })

  const app = express()
app.use(express.json())
app.use("/api/books", books)
app.use("/api/auth", users)
app.use (cors())

app.listen(5000, () => {
  console.log("server is listening on port:" + 5000)
})

