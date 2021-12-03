const mongoose = require("mongoose")
const Joi = require("joi")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
  },
})

const userJoi = Joi.object({
    firstName : Joi.string().min(2).max(20).required() ,
    lastName : Joi.string().min(2).max(20).required() ,
    email : Joi.string().email( { tlds : {allow : false } } ).min(2).max(100).required() ,
    avatar : Joi.string().uri().min(2).max(1000) ,
    password : Joi.string().min(6).max(20).required() 
})

const User = mongoose.model("User" , userSchema) 

module.exports.User = User
module.exports.userJoi = userJoi