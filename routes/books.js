const express = require("express")
const Joi = require("joi")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
const mongoose = require("mongoose")
const checkId = require("../middleware/checkId.js")
const checkToken = require("../middleware/checkToken")

router.get("/", async (req, res) => {
  const books = await Book.find().select("-__v").populate({
    path: "owner",
    select: "-__v -password",
  })
  res.json(books)
})
////////////////////////////////////////////Get just id /////////////////////////////////////////////
router.get("/:id", checkId, async (req, res) => {
  const book = await Book.findById(req.params.id).select("-__v")
  if (!book) return res.status(404).json("book not found")
  const a = 1234
  a = 12345678
  res.json(book)
})
/////////////////////Post////////////////////////////////////////////

router.post("/", checkToken, async (req, res) => {
  try {
    const Bookbody = req.body
    const { title, description, image, author } = Bookbody
    const result = bookJoi.validate(Bookbody)
    if (result.error) return res.status(400).json(result.error.details[0].message)

    ////////////////////creat post/////////////////////////////////////
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
    res.status(500).json(error, message)
  }
})

////////////////////////////////////////////Put//////////////////////

router.put("/:id", checkId, checkToken, async (req, res) => {
  try {
    const { title, description, image, author } = req.body
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, image, author } },
      { new: true }
    )

    if (!book) return res.status(404).json("book not found")

    res.json(book)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
////////////////////////////////////////////Delete///////////////////////

router.delete("/:id", checkId, checkToken, async (req, res) => {
  try {
    const book = await Book.findOneAndRemove(req.params.id)
    if (!book) return res.status(404).json("book not found")
    res.json("book removed")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
