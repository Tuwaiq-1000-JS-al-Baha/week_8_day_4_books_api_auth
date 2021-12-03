const mongoose = require("mongoose")
const Joi = require("Joi")

const bookSchema = new mongoose.Schema({
  title: String,
  description: {
    type: String,
    default: "no dsecription",
  },
  image: String,
  author: String,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
})

const bookJoi = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(5).max(1000),
  image: Joi.string().uri().min(0).required(),
  author: Joi.string().min(2).max(200).required(),
})

const Book = mongoose.model("Book", bookSchema)
module.exports.Book = Book
module.exports.bookJoi = bookJoi
