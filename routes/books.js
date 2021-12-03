const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
const mongoose = require("mongoose")
const chekToken = require("../middleware/chekToken")
//----------------------------------------------------------------------------------------------------------------------

router.get("/", async (req, res) => {
  const books = await Book.find().select("-__v").limit(50).sort("-dateCreated").populate({
    path: "owner",
    select: "-__v -password",
  })

  res.json(books)
})
//---------------------------------------------------------------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book id should be a valid object id ")

    const book = await Book.findById(id)
    if (!book) {
      return res.status(404).json("book not found")
    }
    res.json(book)
  } catch (error) {
    return res.status(500).json("Internal error")
  }
})
//---------------------------------------------------------------------------------------------------------------------------------------

router.post("/", chekToken, async (req, res) => {
  try {
    const bookBody = req.body
    const { title, description, author, image } = bookBody

    const result = bookJoi.validate(bookBody)

    if (result.error) {
      return res.status(400).json(result.error.details[0].message)
    }

    const book = new Book({
      title,
      description,
      author,
      image,
      owner: req.userId,
    })

    await book.save()
    res.json(book)
  } catch (error) {
    return res.json(error)
  }
})
//-------------------------------------------------------------------------------------------------------------------------------------
router.put("/:id", chekToken, async (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book id should be a valid object id ")
  const { title, description, author, image } = req.body
  try {
    let book = await Book.findById(id)
    if (!book) return res.status(404).json("book not found")
    if (book.owner != req.userId) return res.status(403).json("unauthorized action")

    book = await Book.findByIdAndUpdate(
      id,
      {
        $set: { title, description, author, image },
      },
      { new: true }
    )
    res.json(book)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
//------------------------------------------------------------------------------------------------------------------------------

router.delete("/:id", chekToken, async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book id should be a valid object id ")
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).json("book not found")

    if (book.owner != req.userId) return res.status(403).json("unauthorized action")

    await Book.findByIdAndRemove(id)
    res.json("book removed")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

module.exports = router
