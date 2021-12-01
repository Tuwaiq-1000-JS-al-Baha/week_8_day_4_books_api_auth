const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../Model/Book")
const mongoose = require("mongoose")
const checkId = require("../middleware/checkId")
const { request } = require("express")

const checkToken = require("../middleware/checkToken")

router.get("/", async (req, res) => {
  let books = await Book.find().limit(50).populate({
    path: "owner",
    select: "-__v -password",
  })
  res.json(books)
})

router.get("/:id", checkId, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json("book not found")
    }
    res.json(book)
  } catch (error) {
    return res.status(500).json("Internal error")
  }
})

router.post("/", checkToken, async (req, res) => {
  const bookBody = req.body
  const result = bookJoi.validate(bookBody)
  if (result.error) {
    return res.status(400).json(result.error.details[0].message)
  }
  const book = new Book({
    title: bookBody.title,
    description: bookBody.description,
    image: bookBody.image,
    author:bookBody.author,

    owner: req.userId,
  })
  try {
    await book.save()
  } catch (error) {
    return res.json(error)
  }
  res.json(book)
})

router.put("/:id", checkToken, async (req, res) => {
  const id = req.params.id
  const { title, body, image, owner } = req.body
  const book = await Book.findByIdAndUpdate(
    id,
    {
      $set: { title, body, image, owner },
    },
    { new: true }
  )
  if (!book) return res.status(404).json("book not found")

  res.json(book)
})

router.delete("/:id", checkToken, async (req, res) => {
  const book = await Book.findById(req.params.id)
  if (!book) return res.status(404).json("book not found")
  await book.remove()
  res.json("book removed")
})

module.exports = router
