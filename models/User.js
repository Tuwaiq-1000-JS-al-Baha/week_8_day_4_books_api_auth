const mongoose = require("mongoose")
const Joi = require("joi")
const userSchema = new mongoose.Schema({
   firstName : String,
   lastName : String,
   email : String,
   password : String,
   avatar : {
       type :String,
       default :"https://media.tiffany.com/is/image/Tiffany/EcomItemL2/assouline-windows-attiffany-co-book-62721499_991682_ED.jpg",
   }
})
const signupJoi = Joi.object({
firstName:Joi.string().min(3).max(50).required() ,
lastName:Joi.string().min(3).max(50).required() ,
email:Joi.string().email({tlds: { allow : true }}).required() ,
password:Joi.string().min(6).max(128).required() , 
avatar : Joi.string().uri(),
})
const loginJoi = Joi.object({
    email:Joi.string().email({tlds: { allow : true }}).required() ,
    password:Joi.string().uri().min(6).max(128).required()
    })
const User = mongoose.model("User" , userSchema)
module.exports.User = User
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi