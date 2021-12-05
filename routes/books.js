const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
const checkId = require("../middleware/checkld")
const checkToken = require("../middleware/checkToken")

router.get("/", async (req, res) => {
  let books = await Post.find().select("-__v").populate({
    path: "owner",
    select: "-__v -password",
  })
  res.json(books)
})

router.get("/:id", checkId, async (req, res) => {
  const book = await Book.findById(req.params.id).select("-__v")
  if (!book) return res.status(404).json("book not found")
  res.json(book)
})

router.post("/", checkToken, async (req, res) => {
  try {
    const bookBody = req.body
    const { title, description, author, image } = bookBody
    const result = bookJoi.validate(bookBody)

    if (result.error) return res.status(400).json(result.error.details[0].message)

    const book = new Book({
      title,
      description,
      author,
      image,
    })
    await book.save()
    res.json(book)
  } catch (error) {
    res.status(500).json("error.message")
  }
})
router.put("/:id", checkId, checkToken, async (req, res) => {
  try {
    const { title, description, author, image } = req.body

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, author, image } },
      { new: true }
    )
    if (!book) return res.status(400).json("book not found")

    res.json(post)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.delete("/:id", checkToken, checkId, async (req, res) => {
  try {
    const book = await Book.findOneAndRemove(req.params.id)
    if (!book) return res.status(404).json("book not found")

    res.json("book is removed ")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
