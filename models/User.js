const mongoose = require("mongoose")
const Joi = require("joi")

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default:
      "https://www.donkey.bike/wp-content/uploads/2020/12/user-member-avatar-face-profile-icon-vector-22965342-300x300.jpg",
  },
})

const signupJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string()
    .email({
      tlds: { allow: false },
    })
    .min(2)
    .max(100)
    .required(),
  password: Joi.string().min(6).max(100).required(),
  avatar: Joi.string().uri().max(1000),
})

const loginJoi = Joi.object({
  mail: Joi.string()
    .email({
      tlds: { allow: false },
    })
    .min(2)
    .max(100)
    .required(),
  password: Joi.string().min(6).max(100).required(),
})

const User = mongoose.model("User", userSchema)

module.exports.User = User
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
