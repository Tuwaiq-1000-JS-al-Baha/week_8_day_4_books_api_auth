const mongoose =require("mongoose")
const express =require("express")
const router =express.Router()
const {Book,bookJoi}=require("../models/Book")
const checkId = require("../midlewaer/checkId")
const checkJoi = require("../midlewaer/checkJoi")
const checkToken=require("../midlewaer/checkToken")


router.get("/",async(req,res)=>{
const books= await Book.find()
res.json(books)

})

router.get("/:id",checkId,async(req,res)=>{
    try{
        const id=req.params.id
        let book = await Book.findById(id)
        if(!book) return res.status(404).json("book is not found")
     res.json(book)
        
      
    }catch(error){
    return res.json("interall error")
    }
})

router.post("/",checkToken,checkJoi,async(req,res)=>{
    const{title,description,image,author}=req.body
   
const book =new Book({
    title,
    description,
    image,
    author,
})
try{
 await book.save()
}catch(error){
    return res.status(500).json("interal erorr")
}
res.json(book)

})

router.put("/:id",checkToken,checkId,async(req,res)=>{
    try{
        const{title,description,image,author}=req.body
          let book = await Book.findById(req.params.id)
        if(!book) return res.status(404).json("book is not found")
book =await Book.findByIdAndUpdate(req.params.id,{
    $set:{title,description,image,author}
        
},{new:true})
res.json(book)

    }catch(error){
      return  res.status(500).json(error.message)
    }
})

router.delete("/:id",checkToken,checkId,async(req,res)=>{
    try{
    const id=req.params.id
    let book = await Book.findById(id)
    if(!book) return res.status(404).json("book is not found")
    await book.remove()
    res.json("it's removed")}
    catch(error){
        return  res.status(500).json(error.message)
        
    }
})

module.exports=router