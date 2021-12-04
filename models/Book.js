const Joi = require("joi")
const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema({
  title: String,
  description:String,
  auther:String,
  image: {
    type: String,
    default:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png" ,
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
})
const Book = mongoose.model("Book",bookSchema)
module.exports.Book = Book
module.exports.bookJoi = bookJoi