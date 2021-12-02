const mongoose = require("mongoose")
const Joi = require("Joi")

const bookSchema = new mongoose.Schema({
  title: String,
  description: {
    type: String,
    default: "no description",
  },
  numberOfBook: Number,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  auther: String,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
})
const bookJoi = Joi.object({
  title: Joi.string().required().min(2).max(200),
  description: Joi.string().min(5).max(1000),
  auther: Joi.string().min(5).max(1000).required(),
  numberOfBook: Joi.number().min(0).required(),
})

const Book = mongoose.model("Book", bookSchema)

module.exports.Book = Book
module.exports.bookJoi = bookJoi
