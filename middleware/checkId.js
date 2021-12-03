const jwt =require("jsonwebtoken")
const {User}=require("../models/User")
const checkId=async(req,res,next)=>{
    try{
        const token=req.header("Authorization")
        if(!token)return res.status(401).json("token is required")
        const decryptedToken=jwt.verify(token,process.env.Jwt_SECRET_KEY)
        const userId=decryptedToken.id
        const user=await User.findById(userId)
        if(!user) return res.status(404).json("user not found")
        req.userId=user._id
    }catch(error){
        res.status(500).json(error.message)
      }
    
        next()
}
module.exports=checkId