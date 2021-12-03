const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
const mongoose = require("mongoose")
const checkToken = require("../middleware/checkToken")


//--------------------------------
router.get("/", async (req, res) => {
  const books = await Book.find().select("-_v").limit(50).sort("-dateCreated").populate({
    path: "owner",
    select: "-__v -password",
  })

  res.json(books)
})
//---------------------------------------------------------------get one---------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json("book id should be a valid objsect id")
    }
    const book = await Book.findById(id)
    if (!book) {
      return res.status(404).json("product not found")
    }

    res.json(book)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
//----------------------------------------------------------post-------------
router.post("/", chrckToken, async (req, res) => {
  const bookBody = req.body

  const result = bookJoi.validate(bookBody)

  if (result.error) {
    return res.status(400).json(result.error.details[0].message)
  }

  const book = new book({
    title: bookBody.title,
    description: bookBody.description,
    image: bookBody.image,
    owner: req.userId,
  })
  try {
    await book.save()
    res.json(book)
  } catch {
    return res.status(500).json("Internal error")
  }
})
//-----------------------------------------------------------put API----------------
router.put("/:id", chrckToken, async (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json("book not found")

  const { title, description, image } = req.body

  try {
    let book = await Book.findById(id)
    if (!book) return res.status(404).json("book not found")

    if (book.owner != req.userId) return res.status(403).json("unauthorized action")

    book = await Book.findByIdAndUpdate(
      id,
      {
        $set: { title, description, image },
      },
      { new: true }
    )

    res.json(book)
  } catch (error) {
    return res.status(500).json("Internal error")
  }
})

//---------------------------------------------------------delete API-----------------
router.delete("/:id", checkToken, async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book id should be a vlid object")

    const book = await Book.findById(id)
    if (!book) return res.status(404).json("book not found")

    if (book.owner != req.userId) return res.status(400).json("unauthorized action")

    await Book.findByIdAndRemove(id)
    res.json("book removed")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

module.exports = router