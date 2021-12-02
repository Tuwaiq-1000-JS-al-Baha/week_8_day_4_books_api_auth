const mongoose = require("mongoose")
const router = require("../routes/books")

const checkId = async (req, res, next) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) res.status(400).json("post id should be a valid object id")
  else next()
}

module.exports = checkId
