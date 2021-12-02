const express = require("express")
const { Book, postJoi } = require("../models/Book")
const checkId = require("../middleware/checkId")
const { User } = require("../models/User")
const checkToken = require("../middleware/checkToken")

const router = express.Router()

router.get("/", async (req, res) => {
  let book = await Book.find().select("-__v").populate({
    path: "author",
    select: "-__v -password",
  })
  res.json(book)
})

router.get("/:id", checkId, async (req, res) => {
  const book = await Book.findById(req.params.id)
  if (!book) {
    return res.status(404).json("book not found")
  }
  res.json(book)
})

router.post("/", checkToken, async (req, res) => {
  try {
    const postBody = req.body
    const { title, description, image } = postBody
    const result = postJoi.validate(postBody)
    if (result.error) return res.status(400).json(result.error.details[0].message)

    const book = new Book({
      title,
      description,
      image,
      author: req.userId,
    })
    await book.save()

    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.put("/:id", checkId, checkToken, async (req, res) => {
  try {
    const { title, description, image } = req.body

    const book = await Book.findByIdAndUpdate(req.params.id,{$set: { title, description, image }},{ new: true })
      
    if (!book) return res.status(404).json("book not found")

    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.delete("/:id", checkId, checkToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id)
    if (!book) return res.status(404).json("book not found")

    res.json("book removed")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
