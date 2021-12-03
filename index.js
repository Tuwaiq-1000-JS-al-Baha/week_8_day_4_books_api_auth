const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const app = express()
require("dotenv").config()
const books=require("./routers/books")
const users=require("./routers/users")

mongoose.connect("mongodb://localhost:27017/testDB").then(()=>{
    console.log("connected to Mongdb")
}).catch(error=>{
    console.log(error)
})


app.use(express.json())
app.use(cors())
app.use("/api/books",books)
app.use("/api/auth",users)

app.listen(5000,()=>{
    console.log("server is listining on port:",5000)
})