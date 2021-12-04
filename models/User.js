const mongoose = require("mongoose")
const Joi = require("joi")
const userSchema =new mongoose.Schema({
    firstName:String,
    lastName:String,
   email :String,
   password: String,
   avatar :{
       type:String,
       default:"https://cdn.dribbble.com/users/2199928/screenshots/11532918/media/5a7273b592ea860e6d0ff2931ecab4f3.png?compress=1&resize=400x300"
   },
})
const userJoi = Joi.object({
 firstName: Joi.string().min(2).max(100).required(),
 lastName: Joi.string().min(2).max(100).required(),
    email:Joi.string()
    .email({ tlds:{allow: false} })
    .required(),
    password:Joi.string().min(6).max(120).required(),
    avatar:Joi.string().min(2).max(10000),
})
const User = mongoose.model("User", userSchema)
module.exports.User = User
module.exports.userJoi = userJoi