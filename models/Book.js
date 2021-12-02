const mongoose = require("mongoose")
const Joi = require("joi")
const { object } = require("joi")

const postSchema = new mongoose.Schema({
  title: String,
  description: {
    type: String,
    default: "no body",
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
    default: "https://wallup.net/wp-content/uploads/2017/03/28/436025-water-waterfall-nature-outdoors-rocks.jpg",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
})

const postJoi = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  description: Joi.string().max(250),
  image: Joi.string().uri().max(1000),
  author: Joi.string().required(),
})

const Book = mongoose.model("Book", postSchema)
module.exports.Book = Book
module.exports.postJoi = postJoi
