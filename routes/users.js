const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User, signupJoi, loginJoi } = require("../models/User")
const checkToken = require("../middleware/checkToken")

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body

    const result = signupJoi.validate(req.body)
    if (result.error) return res.status(400).json(result.error.datails[0].massage)

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json("user already regstered")

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
    delete user._doc.password

    res.json(user)
  } catch (error) {
    res.status(500).send(error.massage)
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const result = loginJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.datails[0].massage)

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not found")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ sup: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.massage)
  }
})

router.get("/profile", checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v -password")
    if (!user) return res.status(404).send("user not found")

    res.send(user)
  } catch (error) {
    res.status(500).json(error.massage)
  }
})

module.exports = router
