// ---require---
const express = require("express")
const router = express.Router()
const { User, loginJoi, signupJoi } = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const checkToken = require("../middlewara/checkToken")

// ---signup----
router.post("/signup", async (req, res) => {
  try {
    const userBody = req.body
    const { firstName, lastName, email, password, avatar } = userBody

    const result = signupJoi.validate(userBody)

    if (!result) return res.status(400).json(result.error.details[0].message)

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json("user is already registerd")

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

// ---login---
router.post("/login", async (req, res) => {
  try {
    const userBody = req.body
    const { email, password } = userBody
    const result = loginJoi.validate(userBody)

    if (!result) return res.status(400).json(result.error.details[0].message)

    const userFound = await User.findOne({ email })
    if (!userFound) return res.status(400).json("user not registerd")

    const valid = await bcrypt.compare(password, userFound.password)
    if (!valid) return res.status(400).json("password incorrect")
    const token = jwt.sign({ sub: userFound._id }, process.env.JWT_SECRET_KEY, { expiresIn: "20d" })

    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// ---profile---

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
