const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
const mongoose = require("mongoose")
const checkid = require("../middleware/checkid")
const checktoken = require("../middleware/checktoken")
//-----------------------get---------------------------
router.get("/", async (req, res) => {
  try {
    const books = await Book.find()
      .select("-__v")
      .populate({
        path: "owmer",
        select: "-__v -password",
      })
      .sort("-detacreated")
    res.json(books)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
//-------------------------get one book----------------------
router.get("/:id", checkid, async (req, res) => {
  try {
    const books = await Book.findById(req.params.id)
    if (!books) return res.status(404).json("books is not found")
    res.json(books)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
//----------------------------post---------------------------
router.post("/", async (req, res) => {
  try {
    const bodybook = req.body
    const { title, description, image, author } = bodybook
    const result = bookJoi.validate(bodybook)
    if (result.error) return res.status(400).json(result.error.details[0].message)
    const books = new Book({
      title,
      description,
      image,
      author,
      user: req.userId,
    })
    await books.save()
    res.json(books)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
//----------------------------put----------------------
router.put("/:id", checkid, checktoken, async (req, res) => {
  try {
    const { title, description, image, author } = req.body
    let books = await Book.findById(req.params.id)
    if (!books) return res.status(404).json("book not found ")
    if (books.owner != req.userId) return res.status(403).json("unauthorized action")
    books = await Book.findByIdAndUpdate(req.params.id, { $st: { title, description, image, author } }, { new: true })
    res.json(books)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
//---------------delete--------------------------
router.delete("/:id", checkid, checktoken, async (req, res) => {
  try {
    const books = await Book.findByIdAndRemove(req.params.id)
    if (!books) return res.status(404).json("book is not found ")
    if (books.owner != req.userId) return res.status(403).json("unauthorized action ")
    await Book.findByIdAndUpdate(req.params.id)
    res.json("book removed ")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
module.exports = router
