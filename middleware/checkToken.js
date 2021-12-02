const jwt = require("jsonwebtoken")
const { User } = require("../models/User")
const router = require("../routes/books")

const checkToken = async (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) return res.status(401).json("token is required")
  try {
    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decryptedToken.id

    const user = await User.findById(userId)
    if (!user) return res.status(400).json("user not found")
    req.userId = user._id
  } catch (error) {
    res.status(500).json(error.massege)
  }
  next()
}

module.exports = checkToken
