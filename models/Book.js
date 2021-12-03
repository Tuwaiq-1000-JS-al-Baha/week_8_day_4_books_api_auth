const mongoose = require("mongoose")
const Joi = require("joi")

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  author: String,
  onwer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  deteCreated: {
    type: Date,
    default: Date.now,
  },
})

const bookJoi = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(3).max(1000).required(),
  author: Joi.string().min(2).max(100).required(),
  image: Joi.string().uri().min(5).max(1000).required(),
})
const Book = mongoose.model("book", bookSchema)
module.exports.Book = Book
module.exports.bookJoi = bookJoi
