const express = require("express");
const { Book, bookJoi } = require("../models/Book")
const router = express.Router();
const checkId = require("../middleware/checkid");
const checkToken = require("../middleware/checkToken");

//..........GET..............
router.get("/", async (req, res) => {
  const books = await Book.find().select("-__v").populate({
    path:"owner",
    select:"-__v -password",
  })
  res.json(books);
});

//..........GETBYID..............

router.get("/:id", checkId, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json("book not found");
  }
  res.json(book);
});

//..........POST..............
router.post("/", checkToken, async (req, res) => {
  try {
    const bookBody = req.body;
    const { title, description, image, author } = bookBody;
    const result = bookJoi.validate(bookBody);

    if (result.error)
      return res.status(400).json(result.error.details[0].message);

    const book = new Book({
      title,
      description,
      image,
      author,
      owner: req.userId,
    });

    await book.save();

    res.json(book);
  } catch (error) {
    return res.json(error);
  }
});

//..........PUT..............
router.put("/:id", checkId, checkToken, async (req, res) => {
  const id = req.params.id;
  const { title, description, image, author } = req.body;
  try {
    let book = await Book.findById(id);
    if (!book) return res.status(404).json("book not found");

    book = await Book.findByIdAndUpdate(
      id,

      {
        $set: { title, description, image, author },
      },
      { new: true }
    );
    if (!book) return res.status(404).json("book not found");

    if (book.owner.toString() != req.userId.toString())
      return res.status(404).json("unauthorized action");
    book = await Book.findByIdAndUpdate(
      id,
      { $set: { title, description, image, author } },
      { new: true }
    );

    res.json(book);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//..........delete..............

router.delete("/:id", checkId, checkToken, async (req, res) => {
  try {
    const id = req.params.id;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json("book not found");

    if (book.owner.toString() != req.userId.toString())
      return res.status(404).send("unauthorized action");

    await Book.findByIdAndRemove(id);

    res.json("book remove");
  } catch (error) {
    res.status(500).json(error.message);
  }
});
module.exports = router;
