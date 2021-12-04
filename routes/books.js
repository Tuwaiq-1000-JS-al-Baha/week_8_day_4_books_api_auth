const express = require("express")
const { Book, bookJoi } = require("../models/Book")
const router = express.Router()
const mongoose = require("mongoose")
const checkId = require("../middleware/checkId")
const checkToken = require("../middleware/checkToken")
router.get("/", async (req, res) => {
  let books = await Book.find().select("-__v").populate({
    path: "owner",
    select: "-__v -password",
  })
  res.json(books)
})
//get
router.get("/:id", checkId, async (req, res) => {
  const book = await Book.findById(req.params.id).select("-__v")
  if (!book) return res.status(404).json("book not found")
  res.json(book)
})
//post
router.post("/", checkToken, async (req, res) => {
  try {
    const bookBody = req.body
    const { title, description, image, author } = bookBody
    const result = bookJoi.validate(bookBody)
    if (result.error) return res.status(400).json(result.error.details[0].message)

    const book = new Book({
      title,
      description,
      image,
      author,
      owner: req.userId,
    })
    await book.save()
    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
//put
router.put("/:id", checkId, checkToken, async (req, res) => {
  try {
    const { title, body, image } = req.body

    const book = await Book.findByIdAndUpdate(req.params.id, { $set: { title, body, image } }, { new: true })
    if (!book) return res.status(404).json("book not found")
    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
//delete
router.delete("/:id", checkId, checkToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).json("book not found")

    res.json("book removed")
  } catch (error) {
    res.status(500).json(error.message)
  }
})
module.exports = router
