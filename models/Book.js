const mongoose = require("mongoose")
const Joi = require("joi")
const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  author: String,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
})

const bookJoi = Joi.object({
  title: Joi.string().min(10).max(100).required(),
  description: Joi.string().min(10).max(2000).required(),
  image: Joi.string().uri().max(1000),
  author: Joi.string().min(2).max(80).required(),
})
const Book = mongoose.model("Book", bookSchema)

module.exports.Book = Book
module.exports.bookJoi = bookJoi
