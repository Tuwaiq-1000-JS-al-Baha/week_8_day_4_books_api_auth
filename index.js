const express = require("express")
const bodyParser = require("body-parser")
const books = require("./Routes/books")
const mongoose = require("mongoose")
const user = require("./Routes/users")
require("dotenv").config()

mongoose.connect(`mongodb+srv://Magdi7021:Mmagdi70217021@cluster0.egoyx.mongodb.net/test`).then(() => {
  console.log("Mongoos is connected")
})
.catch(error => {
  console.log("the Error is", error)
})

const app = express()


app.use(bodyParser.json())
app.use("/api/books" , books )
app.use("/api/auth" , user)


app.listen(3000 , () => {
  console.log("the server is listening on port " + 3000)
})