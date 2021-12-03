const { Book } = require("../models/Book")
const mongoose=require("mongoose")
const checkId =async (req,res,next)=>{
    try{
        const id=req.params.id
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json(" id should be a valid object id")
        }
      
        next()
        
      
    }catch(error){
    return res.json("interall error")
    }
    
}
module.exports=checkId

