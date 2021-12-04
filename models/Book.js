const mongoose = require("mongoose")
const Joi = require("joi")

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  image: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYmK4wODOzAmehZDzK1R_6-Kt3nk3PprhCcw&usqp=CAU",
  },
  dateCreated: {
    type: Date,

    default: Date.now,
  },

  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
})
const bookJoi = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(7).max(200).required(),
  author: Joi.string().min(2).max(200).required(),
  image: Joi.string().uri().max(1000),
})
const Book = mongoose.model("Book", bookSchema)

module.exports.Book = Book
module.exports.bookJoi = bookJoi
