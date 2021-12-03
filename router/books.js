const express = require("express")
const router = express.Router()
const {Book , bookJoi} = require("../models/Book")
const mongoose = require("mongoose")
const checkToken = require("../middleware/checkToken")



// get all books
router.get("/" , async (req , res )=> {
   const books = await Book.find().populate({
    path : "owner" , 
    select : "-__v -password"
  })

    res.json(books)
})
router.get("/:id" , async (req , res) => {
    try {
        const id = req.params.id
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json("valid is id")
        }
        const book = await Book.findById(id)
        if(!book){
           return res.status(404).json("book is not defind")
        }
        res.json(book)
    } catch(error){
        return res.status(500).json("internal error")
    }
})
router.post("/" ,checkToken, async (req , res)=> {
    const bookBody = req.body
    const {title , description , image , author} = bookBody
    const result = bookJoi.validate(bookBody)

    if(result.error){
        return res.status(400).json(result.error.details[0].message)
    }
    const newBook = new Book ({
        title , 
        description ,
        image  ,
        author ,
        owner : req.userId,
    })
    try {
        await newBook.save()

    } catch(error) {
        return res.status(500).json("internal error")
    }
    res.json(newBook)
})
//edit post
router.put("/:id", checkToken , async (req , res ) => {
    try {
    const id = req.params.id
    
    const {title , body , image} = req.body

    const post = await Book.findByIdAndUpdate(id , {
        $set: {
        title, 
        body ,
        image, 
        }} , 
        {new : true} , 
    )
    if(!post)
    return res.status(404).json("post not found")

    res.json("product is upadted")
    } catch(error) {
        res.status(500).json(error.message)
    }
})

//delete
router.delete("/:id",  checkToken,  async (req , res ) => {
    try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json("vaild id");
      }
      const book = await Book.findById(id)

    if(!book)
    return res.status(404).json("book is not found ")
    if(product.owner != req.userId) return res.status(403).json("Unauthorized action")
    await book.findByIdAndRemove(id)

    res.json("book removed")
    } catch (error){
        res.status(500).json(error.message)
    }
})

    // .select().sort("-dateCreated")
    // .populate({
    //     path : "author" , 
    //     select : "-__v -password" 
    // })


module.exports=router