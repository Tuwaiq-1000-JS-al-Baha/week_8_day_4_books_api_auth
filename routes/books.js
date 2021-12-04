const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
const checkId = require("../middleware/checkId")
const checkToken = require("../middleware/checkToken")
const { User } = require("../models/User")
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort("-releaseYear").populate({
      path: "owner",
      select: "-__v -password",
    })

    res.send(books)
  } catch (error) {
    res.status(500).send("Internal error", error.message)
  }
})

router.get("/:id", checkId, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).send("book not found")
    res.send(book)
  } catch (error) {
    res.status(500).send("Internal error", error.message)
  }
})

router.post("/", checkToken, async (req, res) => {
  try {
    const result = bookJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)
    const { title, numberOfCopies, author } = req.body
    const book = new Book({
      title,
      numberOfCopies,
      author,
      owner: req.userId,
    })
    await book.save()
    await User.findByIdAndUpdate(req.userId, { $push: { books: book._id } })
    res.json(book)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.put("/:id", checkId, checkToken, async (req, res) => {
  try {
    const { title, numberOfCopies, author } = req.body
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: { title, numberOfCopies, author },
      },
      { new: true }
    )
    if (!book) return res.status(404).send("book not found")
    res.send(book)
  } catch (error) {
    res.status(500).send("Internal error", error.message)
  }
})

router.delete("/:id", checkId, checkToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).send("book not found")

    await book.remove()
    res.send("book removed")
  } catch (error) {
    res.status(500).send("Internal error", error.message)
  }
})
module.exports = router
