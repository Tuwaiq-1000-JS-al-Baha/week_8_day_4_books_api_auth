const mongoose = require("mongoose")

const validId = async (req, res, next) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("book id should a valid object id")
  next()
}

module.exports = validId
