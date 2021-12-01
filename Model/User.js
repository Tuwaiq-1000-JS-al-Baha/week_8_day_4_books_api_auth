const mongoose = require("mongoose")
const Joi = require("joi")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: String,
})

const userJoi = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email : Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
  avatar: Joi.string().uri().max(1000),
})

const User = mongoose.model("User", userSchema)

module.exports.User = User
module.exports.userJoi = userJoi
