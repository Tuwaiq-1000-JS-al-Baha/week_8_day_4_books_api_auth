const Joi = require("joi")
const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
  title: String,
  description:String,
  auther:String,
 
  image: {
    type: String,
    default:"https://cutewallpaper.org/21/anime-1080-x-1080/view-page-21.html" ,
  },
  owner:{
   type: mongoose.Types.ObjectId,
   ref:"User",
  },

})

const bookJoi = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(5).max(1000).required(),
  image: Joi.string().uri().max(2000),
  auther: Joi.string().min(5).max(200).required(),

//   owner: Joi.string().min(0).max(100).required(),
})


const Book = mongoose.model("Book",bookSchema)
module.exports.Book = Book
module.exports.bookJoi = bookJoi
