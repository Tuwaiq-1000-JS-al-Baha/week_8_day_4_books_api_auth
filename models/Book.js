const mongoose=require("mongoose");
const joi= require("joi")

const bookSchema=new mongoose.Schema({
    title:String, 
    description:String,
    image:String,
    author:String,
    owner: {
        type: mongoose.Types.ObjectId,
        ref:"User",
      },
})

const bookJoi=joi.object({
    title:joi.string().min(2).max(200).required(),
    description:joi.string().min(2).max(200).required(),
    image:joi.string().uri().max(2000).required(),
    author:joi.string().max(2000).required(),


})

const Book=mongoose.model("Book",bookSchema)

module.exports.Book =Book
module.exports.bookJoi =bookJoi
