const mongose = require("mongoose")
const checkid = async (req, res, next) => {
  try {
    const id = req.params.id
    if (!mongose.Types.ObjectId.isValid(id)) return res.status(400).json("postid is not object id ")
  } catch (error) {
    return res.status(500).json(error.message)
  }
  next()
}
module.exports = checkid
