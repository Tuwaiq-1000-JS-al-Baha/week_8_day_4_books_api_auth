const mongoose = require("mongoose")
const Joi = require("Joi")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: "https://image.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg",
  },
})

const userJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string()
    .email({
      tlds: { allow: false },
    })
    .required(),
  password: Joi.string().min(2).max(100).required(),
  avatar: Joi.string().uri().min(2).max(100).allow(""),
})

const User = mongoose.model("User", userSchema)

module.exports.User = User
module.exports.userJoi = userJoi
