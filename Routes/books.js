const express = require("express")
const { Book, booksJoi } = require("../models/Book")
const checkId = require("../middleware/checkId")
const checkToken = require("../middleware/checkToken")

const router = express.Router()

router.get("/", async (req, res) => {
  const book = await Book.find().select("-__v").sort("-dateCreated").populate({
      path : "owner" ,
      select : "-__v -password"
  })
  res.json(book)
})
router.get("/:id",  checkId, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).select("-__v")
    if (!book) return res.status(404).json("The element not found")
    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.post("/", checkToken, async (req, res) => {
  try {
    const booksBody = req.body
    const { title, description, image, author } = booksBody
    const result = booksJoi.validate(booksBody)
    if (result.error) return res.status(400).json(result.error.details[0].message)
    const books = new Book({
      title,
      description,
      image,
      author,
      owner : req.userId
    })
    await books.save()
    res.json(books)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.put("/:id", checkToken, checkId, async (req, res) => {
  try {
    const id = req.params.id
    const { title, description, image, author } = req.body
    const book = await Book.findByIdAndUpdate(
      id,
      {
        $set: { title, description, image, author },
      },
      { new: true }
    ).select("-__v")
    if (!book) return res.status(404).json("The element not Found")
    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.delete("/:id" , checkToken, checkId , async (req , res) => {
    const id = req.params.id
    const book = await Book.findById(id)
    if (!book) return res.status(404).json("The element not Found")
    await book.remove()
    res.json("The book is delete")
})

module.exports = router