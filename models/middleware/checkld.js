const mongoose = require("mongoose")

const chechId = async (req, res, next) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("post id is not found ").
  next()
}
module.exports = chechId
