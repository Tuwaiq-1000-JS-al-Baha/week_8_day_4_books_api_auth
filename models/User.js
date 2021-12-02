const mongoose = require("mongoose")
const Joi = require("joi")


const userSchema =new mongoose.Schema({
    firstName:String,
    lastName:String,
   email :String,
   password: String,
   avatar :{
       type:String,
       default:"https://www.pinterest.com/pin/714102084649632696/"
   },

})

const userJoi = Joi.object({
 firstName: Joi.string().min(2).max(100).required(),
 lastName: Joi.string().min(2).max(100).required(),
    email:Joi.string()
    .email({ tlds:{allow: false} })
    .required(),
    password:Joi.string().min(6).max(120).required(),
    avatar:Joi.string().min(2).max(1000),
})


const User = mongoose.model("User", userSchema)


module.exports.User = User
module.exports.userJoi = userJoi