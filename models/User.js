const mongoose = require("mongoose")
const Joi = require("joi")

const userSchema = {
  first_Name: String,
  last_Name: String,
  email: String,
  password: String,
}

const userJoi = Joi.object({
  first_Name: Joi.string().min(2).required(),
  last_Name: Joi.string().min(2).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).required(),
})

const User = mongoose.model("User", userSchema)

module.exports.User = User
module.exports.userJoi = userJoi
