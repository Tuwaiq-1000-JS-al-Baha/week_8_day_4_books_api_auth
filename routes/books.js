const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../models/book")
const checkId = require("../middleware/checkId")
const checkToken = require("../middleware/checkToken")

router.get("/", async (req, res) => {
  const books = await Book.find().select("-__v").limit(50).sort("-dateCreated").populate({
    path: "owner",
    select: "-__v -password",
  })
  res.json(books)
})

router.get("/:id", checkId, async (req, res) => {
  const book = await Book.findById(req.params.id)
  if (!book) return res.json("book not found")
  res.json(book)
})

router.post("/", checkToken, async (req, res) => {
  const bookBody = req.body

  const result = bookJoi.validate(bookBody)

  if (result.error) return res.status(400).json(result.error.details[0].message)

  const book = new Book({
    title: bookBody.title,
    description: bookBody.description,
    numberOfBook: bookBody.numberOfBook,
    auther: bookBody.auther,
  })
  try {
    await book.save()
    res.json(book)
  } catch (error) {
    return res.status(500).json("Internal error")
  }
})

router.put("/:id", checkId, checkToken, async (req, res) => {
  const id = req.params.id
  const { title, description, numberOfBook, auther } = req.body
  // const book = await book.findById(id)
  try {
    const book = await Book.findByIdAndUpdate(
      id,
      {
        $set: { title: title, description: description, numberOfBook: numberOfBook, auther: auther },
      }, // لو الكي مساوي للفاليو نقدر نحذف الفاليو
      { new: true }
    )
    if (!book) return res.status(404).json("book not found")
    // if (title) book.title = title
    // if (description) book.description = description
    // if (price) book.price = price

    // await book.save()
    res.json(book)
  } catch (error) {
    return res.status(500).json(error.massege)
  }
})

router.delete("/:id", checkId, checkToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).json("book not found")
    await book.remove()
    res.json("book removed")
  } catch (error) {
    return res.status(500).json(error.massege)
  }
})
module.exports = router
