const mongoose=require("mongoose")
const Joi=require("joi")

const userSchema=new mongoose.Schema({
    firstName:String,
    lastName:String,
    password:String,
    email:String,
    avatar:String
})

const signupJoi=Joi.object({
    firstName:Joi.string().min(3).required(),
    lastName:Joi.string().required(),
    avatar:Joi.string().uri().required(),
    email:Joi.string().email({tlds:{allow:true}}).required(),
    password:Joi.string().min(2).max(120).required(),

})

const loginJoi=Joi.object({
    email:Joi.string().email({tlds:{allow:true}}).required(),
    password:Joi.string().min(2).max(120).required(),
})

const User=mongoose.model("User",userSchema)

module.exports.User=User
module.exports.signupJoi=signupJoi
module.exports.loginJoi=loginJoi