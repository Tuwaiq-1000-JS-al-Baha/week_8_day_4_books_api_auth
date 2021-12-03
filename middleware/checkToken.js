const jwt = require("jsonwebtoken")
const { User } = require("../models/User")
const checkId = require("./checkId")

const checkToken = async (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) return res.status(401).json("token is required")

  const decryptedToken = jwt.verify(token, process.env.jWT_SECRET_KEY)
  const userId = decryptedToken.sub
  const user = await User.findById(userId)

  if (!user) return res.status(404).json("user not found")

  req.userId = userId
  next()
}

module.exports = checkToken
