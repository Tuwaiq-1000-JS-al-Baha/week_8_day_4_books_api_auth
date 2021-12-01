const express = require("express")
const { User, userJoi } = require("../models/User")
const bcrypt = require("bcrypt")
const Jwt = require("jsonwebtoken")
const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    const userBody = req.body
    const { firstName, lastName, email, password, avatar } = userBody
    const result = userJoi.validate(userBody)
    if (result.error) return res.status(400).json(result.error.details[0].message)
    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json("You Already Registers")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      avatar,
    })
    await user.save()
    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("Should be registered")
    const result = await bcrypt.compare(password, user.password)
    if (!result) return res.status(404).json("incorrect Password")
    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "16d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
router.get("/profile" , async (req , res) => {
  try {
  const token = req.header("Authorization")
  const decryptedtoken = Jwt.verify(token , process.env.JWT_SECRET_KEY)
  const id = decryptedtoken.id
  const user = await User.findById(id).select("-__v -password")
  if (!user) return res.status(404).json("The user not Found")
  res.json(user)
  } catch  (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
