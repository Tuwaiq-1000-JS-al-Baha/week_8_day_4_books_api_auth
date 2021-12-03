const mongoose = require("mongoose")
const Joi = require("joi")

const booksSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  author: String,
  owner : {
      type : mongoose.Types.ObjectId ,
      ref : "User"
  } ,
  dateCreated : {
      type :Date ,
      default : Date.now ,
  }
})

const booksJoi = Joi.object({
  title: Joi.string().min(2).max(20).required(),
  description: Joi.string().min(5).max(200).required(),
  image: Joi.string().uri().min(2).max(1000),
  author: Joi.string().min(2).max(80).required(),
})

const Book = mongoose.model("Book", booksSchema)

module.exports.Book = Book
module.exports.booksJoi = booksJoi