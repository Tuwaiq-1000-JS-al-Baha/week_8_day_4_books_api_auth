const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
const mongoose = require("mongoose")
const checkToken = require("../middleware/checkToken")

router.get("/", async (req, res) => {
  const book = await Book.find().select("-__v").limit(50).sort("-dateCreated").populate({
    path: "owner",
    select: "-__v -password",
  })

  res.json(book)
})

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("book id is should be a vaild object id")
    }
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json("book not found")
    }
    res.json(book)
  } catch (error) {
    return res.status(500).json("internal error")
  }
})

router.post("/", checkToken, async (req, res) => {
  try {
    const bookBody = req.body
    const { title, description, image, author } = bookBody
    const result = bookJoi.validate(bookBody)

    if (result.error) {
      return res.status(400).json(result.error.details[0].message)
    }

    const book = new Book({
      title,
      description,
      image,
      author,
      owner: req.userId,
    })
    await book.save()
    res.send(book)
  } catch (error) {
    res.status(500).json("internal error")
  }
})

router.put("/:id", checkToken, async (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book id should be a vaild object id")

  const { title, description, image, author } = req.body
  try {
    let book = await Book.findById(id)
    if (!book) return res.status(404).json("book not found")

    if (book.owner.toString() != req.userId) return res.status(403).send("unauthorized action")

    book = await Book.findByIdAndUpdate(
      id,
      {
        $set: { title, description, image, author },
      },
      { new: true }
    )

    res.json(book)
  } catch (error) {
    res.status(500).json("internal error")
  }
})

router.delete("/:id", checkToken, async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book id should be a vaild object id")

    const book = await Book.findById(id)
    if (!book) return res.status(404).json("book not found")
    console.log(book.owner)
    console.log(req.userId)
    if (book.owner.toString() != req.userId) return res.status(403).send("unauthorized action")

    await Book.findByIdAndRemove(id)
    res.json("book removed")
  } catch (error) {
    res.status(500).json("internal error")
  }
})
module.exports = router
