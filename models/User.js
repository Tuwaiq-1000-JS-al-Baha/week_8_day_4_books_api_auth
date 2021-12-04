const mongoose = require("mongoose")
const Joi = require("joi")
const { string } = require("joi")

const userScema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default:
      "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
})

const userJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(2).max(100).required(),
  avatar: Joi.string().uri().max(100).allow(""),
})

const User = mongoose.model("User", userScema)

module.exports.User = User
module.exports.userJoi = userJoi
