const mongoose =require("mongoose")
const express =require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const router =express.Router()
const{User,signupJoi,loginJoi}=require("../models/User")
const checkToken = require("../midlewaer/checkToken")


router.post("/signup",async(req,res)=>{
    try{
    const{email,password,firstName,lastName,avatar}=req.body
const result=signupJoi.validate(req.body)
 if(result.error) return res.status(400).send(result.error.details[0].message)
 const foundUser=await User.findOne({email})
 if(foundUser) return res.status(400).send("user already reqistered")

const salt= await bcrypt.genSalt(10)
const hash=await bcrypt.hash(password,salt)
 const user= new User({
     email,
     password:hash,
     firstName,
     lastName,
     avatar,

 })
 await user.save()
 delete user._doc.password
    }catch(error){
        res.status(500).json(error.message)
    }
})

router.post("/login",async(req,res)=>{
    try{
        const{email,password}=req.body
        const result=loginJoi.validate(req.body)
        if(result.error) return res.status(400).send(result.error.details[0].message)

        const user=await User.findOne({email})
        if(!user) return res.status(400).send("user not found")

        const valid=await bcrypt.compare(password,user.password)
        if(!valid) return res.status(400).send("password is incorrect")

        const token=jwt.sign({sub:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"15d"})
        res.json(token)
    }catch(error){
        res.status(500).json(error.message)
    }
})
router.get("/profile",checkToken,async(req,res)=>{
    try{
        const user=await User.findById(req.userId).select("-__v -password")
        if(!user) return res.status(404).send("user not found")

        res.send(user)
    }catch(error){
        res.status(500).json(error.message)
    }
})

module.exports=router