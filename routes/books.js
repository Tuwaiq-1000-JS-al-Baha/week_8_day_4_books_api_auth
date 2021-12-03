const express = require("express")
const router = express.Router()
const { Book, bookJoi } = require("../models/Book")
// const {Book, bookJoi}= require("../models/Book")
const checkId = require("../middleware/checkId")
const checkToken = require("../middleware/checkToken")

////////////get
router.get("/", async (req, res) => {
//   let books = await Book.find()

  let books = await Book.find().select("-__v").populate({
    path: "owner",
    select: "-__v -password",
  })

  res.json(books)
})
//////GET ID
router.get("/:id", checkId, async (req, res) => {
  const book = await Book.findById(req.params.id).select("-__v")
  if (!book) return res.status(404).json("book not found")
  res.json(book)
})

router.post("/", checkToken, async (req, res) => {
  try {
    //     const token = req.header("Authorization")
    //  if(!token)  return res.status(401).json("token is required")
    const bookBody = req.body
    const { title, description,auther, image } = bookBody
    const result = bookJoi.validate(bookBody)

    if (result.error) return res.status(400).json(result.error.details[0].message)

    const book = new Book({
      title,
      description,
      image,
      auther,
      owner: req.userId,
    })

    await book.save()
    res.json(book)
  } catch (error) {
     res.status(500).json(error.message)
  }
})

//////PUT
router.put("/:id",checkId, checkToken, async (req, res) => {
  try {
    // const id = req.params.id
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json("book not found")
    // }
    const { title, description,auther, image } = req.body

    const book = await Book.findByIdAndUpdate( req.params.id, { $set: { title, description,auther, image },}, { new: true })
    if (!book) return res.status(404).json("book not found")

    res.json(book)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

//////////delete
router.delete("/:id", checkId, checkToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id)
    if (!book) return res.status(404).json("book not found")

    res.json("book is removed")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

module.exports = router