const mongoose = require("mongoose")
const Joi = require("joi")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png",
  },
  books: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
  ],
})

const userJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(120).required(),
  avatar: Joi.string().uri().max(1000),
})

const User = mongoose.model("User", userSchema)

module.exports.User = User
module.exports.userJoi = userJoi
