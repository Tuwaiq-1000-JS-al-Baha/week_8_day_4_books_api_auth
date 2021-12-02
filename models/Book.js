const mongoose = require("mongoose")
const Joi = require("joi")

const bookSchema = {
  title: String,
  description: String,
  image: String,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  author: String,
}

const joiBook = Joi.object({
  title: Joi.string().min(4).max(100).required(),
  description: Joi.string().max(300).required(),
  image: Joi.string().uri().required(),
  author: Joi.string().min(4).max(100).required(),
})

const Book = mongoose.model("Book", bookSchema)

module.exports.Book = Book
module.exports.joiBook = joiBook
