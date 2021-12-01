const Jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const checkToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
    if (!token) return res.status(401).json("Token is required")
    const decryptedtoken = Jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decryptedtoken.id
    const user = await User.findById(userId)
    if (!user) return res.status(404).json("User not found")
    req.userId = user._id
    next()
  } catch (error) {
    res.status(500).json(error.message)
  }
}

module.exports = checkToken
