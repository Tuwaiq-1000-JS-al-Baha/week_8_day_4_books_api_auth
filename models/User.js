const mongoose = require("mongoose")
const Joi = require("joi")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  photo: {
    type: String,
    default:
      "https://images.pexels.com/photos/50594/sea-bay-waterfront-beach-50594.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
})
const userJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).max(1000).required(),
  photo: Joi.string().uri().max(1000),
})
const User = mongoose.model("User", userSchema)

module.exports.User = User
module.exports.userJoi = userJoi
