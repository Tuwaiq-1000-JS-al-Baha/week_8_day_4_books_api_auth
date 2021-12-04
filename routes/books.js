const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
const mongoose = require("mongoose")
const checkToken = require("../middleware/checkToken")
const checkId = require("../middleware/checkId")
const { json } = require("body-parser")
router.get("/", async (req, res) => {
  const books = await Book.find().select("-__v").limit(50).populate({
    path: "owner",
    select: "-__v -password",
  })
  res.json(books)
})

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book id should be a vaild object id ")
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).json("book not found")
    res.json(book)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.post("/", checkToken, async (req, res) => {
  try {
    const bookBody = req.body
    const { title, description, auther, image } = bookBody
    const result = bookJoi.validate(bookBody)
    if (result.error) return res.status(400).json(result.error.details[0].message)
    const book = new Book({
      title,
      description,
      image,
      auther,
      owner: req.userId,
    })
    await book.save()
    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.put("/:id", checkToken, async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book id should be a vaild object id ")
    const { title, description, auther, image } = req.body
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, auther, image } },
      { new: true }
    )
    if (!book) return res.status(404).json("book not found")
    res.json(book)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

router.delete("/:id", checkId, checkToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id)
    if (!book) return res.status(404).json("book not found")
    res.json("book is removed")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
module.exports = router
