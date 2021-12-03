const Joi = require("joi")
const mongoose = require("mongoose")


const bookSchema = new mongoose.Schema ({
    title : String ,
    descripton: String , 
    image : {
       type : String ,
       default : "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/assouline-windows-attiffany-co-book-62721499_991682_ED.jpg",
    } , 
    author :String ,
    owner : {
        type : mongoose.Types.ObjectId , 
        ref :"User"
    } ,
    dateCreated :{
        type :  Date , 
        default : Date.now,
    }  
})


const bookJoi = Joi.object({
    title:Joi.string().min(2).max(30).required(),
    description : Joi.string().min(5).max(1000).required(),
    image:Joi.string().uri().max(1000),
    author:Joi.string().min(5).max(50).required(),

})

const Book = mongoose.model("books" , bookSchema)
module.exports.bookJoi = bookJoi
module.exports.Book = Book