const mongoose = require("mongoose")
const Joi = require("joi")

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: {
    type: String,
    default:
      "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1n",
  },
  author: String,
})
const bookJoi = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(5).max(1000),
  author: Joi.number().min(0).required(),
  image: Joi.string().uri().max(1000),

})
const Book = mongoose.model("Book", bookSchema)
module.exports.Book = Book
module.exports.bookJoi = bookJoi
