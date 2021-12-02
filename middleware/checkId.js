const mongoose = require("mongoose")

const checkId = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json("book id is not valid")
  next()
}

module.exports = checkId
