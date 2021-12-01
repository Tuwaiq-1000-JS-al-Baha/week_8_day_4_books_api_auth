const mongoose = require("mongoose")
const Joi = require("joi")
const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  author: String,
  owner: {
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
})

const bookJoi = Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    image:Joi.string().uri().required(),
    author:Joi.string().required(),
  
})

const Book = mongoose.model("Book",bookSchema)

module.exports.Book=Book
module.exports.bookJoi=bookJoi

