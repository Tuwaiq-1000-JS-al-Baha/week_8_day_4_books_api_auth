
const { bookJoi } = require("../models/Book")


const checkJoi= async(req,res,next)=>{
try{
    const result=bookJoi.validate(req.body)
if(result.error) return res.status(400).json(result.error.details[0].message)
next()
}catch(error){
    res.json(error)
}
}

module.exports=checkJoi
