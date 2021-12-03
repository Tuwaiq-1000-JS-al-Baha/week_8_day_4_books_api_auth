const mongoose = require("mongoose")
const Joi = require("joi")
const { date, number } = require("joi")

const bookSchema = new mongoose.Schema({
  title: String,
  numberOfCopies: Number,
  author: String,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  releaseYear: {
    type: Date,
    default: () => {
      const d = new Date()
      return d.getFullYear()
    },
  },
})

const bookJoi = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  numberOfCopies: Joi.number().min(0).required(),
  author: Joi.string().min(2).max(100).required(),
})

const Book = mongoose.model("Book", bookSchema)

module.exports.Book = Book
module.exports.bookJoi = bookJoi
