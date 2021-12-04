const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
const validId = require("../middlewara/vaildId")
const checkToken = require("../middlewara/checkToken")

router.get("/", async (req, res) => {
  const books = await Book.find().select("-__v").limit(10).sort("-dateCreated").populate({
    path: "owner",
    select: "-__v -password",
  })

  res.json(books)
})

router.get("/:id", validId, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.json("book not found")
    }
    res.json(book)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.post("/", checkToken, async (req, res) => {
  const bookBody = req.body
  const { title, description, author, image } = bookBody
  const result = bookJoi.validate(bookBody)
  if (result.error) return res.status(400).json(result.error.details[0].message)

  const book = new Book({
    title,
    description,
    author,
    image,
    owner: req.userId,
  })
  try {
    await book.save()
    res.json(book)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
router.put("/:id", checkToken, async (req, res) => {
  const id = req.params.id
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

    if (!book) return res.status(404).json("book not found")
    res.json(book)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
router.delete("/:id", validId, checkToken, async (req, res) => {
  try {
    const id = req.params.id
    let book = await Book.findById(id)
    if (!book) return res.status(404).json("book not found")

    if (book.owner != req.userId) return res.status(403).json("unauthorized action")
    await Book.findByIdAndRemove(id)
    if (!book) return res.status(404).json("book not found")

    res.json("book remove")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
module.exports = router
