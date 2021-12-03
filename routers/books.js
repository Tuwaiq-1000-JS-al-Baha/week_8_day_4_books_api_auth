const express = require("express")
const routers = express.Router()
const { Book, bookJoi } = require("../models/Book")
const checkId = require("../middleware/checkId")
const checkToken = require("../middleware/checkToken")
const mongoose = require("mongoose")

routers.get("/", async (req, res) => {
  const books = await Book.find().select("-__v").populate({
    path: "owner",
    select: "-__v -password",
  })
  res.json(books)
})

routers.get("/:id", async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book should not be valid object ")

    const book = await Book.findById(id)
    if (!book) return res.status(404).json("book not found")

    res.json(book)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

routers.post("/", checkToken, async (req, res) => {
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

routers.put("/:id", checkToken, async (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book should not be valid object ")
  const bookBody = req.body
  const { title, description, image, author } = bookBody

  try {
    let book = await Book.findById(id)
    if (!book) return res.status(404).json("book not found")

    if (book.owner.toString() != req.userId) return res.status(403).json("authrziton action")

    book = await Book.findByIdAndUpdate(id, { $set: { title, description, image, author } }, { new: true })

    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

routers.delete("/:id", checkToken, async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("post should not be valid object ")

    const book = await Book.findById(id)
    if (!book) return res.status(404).json("book not found")

    if (book.owner.toString() != req.userId) return res.status(403).json("authrziton action")

    await Book.findByIdAndRemove(id)
    res.json("book is removed")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = routers
