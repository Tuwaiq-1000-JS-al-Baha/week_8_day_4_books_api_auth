const mongoos = require("mongoose")

const checkId = async (req, res, next) => {
  const id = req.params.id
  if (!mongoos.Types.ObjectId.isValid(id)) return res.status(400).json("book id is not")
  next()
}
module.exports = checkId
