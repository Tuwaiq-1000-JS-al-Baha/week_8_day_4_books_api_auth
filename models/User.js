const mongoose = require("mongoose")
const Joi = require("Joi")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: String,
})

const signupJoi = Joi.object({
  firstName: Joi.string().min(2).max(120).required(),
  lastName: Joi.string().min(2).max(120).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(2)
    .max(120)
    .required(),
  password: Joi.string().min(6).max(120).required(),
  avatar: Joi.string().uri().min(2).max(120).required(),
})

const loginJoi = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(2)
    .max(120)
    .required(),
  password: Joi.string().min(6).max(120).required(),
})

const User = mongoose.model("User", userSchema)
module.exports.User = User
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
