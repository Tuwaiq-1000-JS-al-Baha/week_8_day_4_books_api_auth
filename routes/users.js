const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User, userJoi } = require("../models/User")
const checkToken = require("../middleware/checkToken")
const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    const userBody = req.body
    const { firstName, lastName, email, password, avatar } = userBody
    const result = userJoi.validate(userBody)
    if (result.error) return res.status(400).json(result.error.details[0].message)

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json("user already registered")

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

    delete user.password

    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not registered")

    const result = await bcrypt.compare(password, user.password)
    if (!result) return res.status(400).json("password incorrect")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.get("/profile", checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v -password")
    if (!user) return res.status(404).json("user not found")

    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
