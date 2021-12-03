const  express =require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app =express()
const books = require("./router/books")
const users = require("./router/users")

app.use(cors())
app.use(express.json())



mongoose.connect(
    `mongodb+srv://user1332Mood:${process.env.MONGODB_PASSWORD}@cluster0.aiiku.mongodb.net/testDB?retryWrites=true&w=majority`
    
    )
.then(() =>  console.log("connected")    )
.catch(error => console.log("error:" , error))

app.use("/books" , books)
app.use("/auth" , users)


app.listen(5000 , () => {
    console.log("server is listen:" + 5000)
})
