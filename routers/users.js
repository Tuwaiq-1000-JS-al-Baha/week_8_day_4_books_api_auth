const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User, loginJoi, signupJoi } = require("../models/User")
const checkToken = require("../middleware/checkToken")
const routers = express.Router()

routers.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, avtar } = req.body

    const result = signupJoi.validate(req.body)
    if (result.error) return res.status(400).json(result.error.details[0].message)

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json("user already register")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      avtar,
    })

    await user.save()

    delete user._doc.password

    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

routers.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const result = loginJoi.validate(req.body)
    if (result.error) return res.status(400).json(result.error.details[0].message)

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not regiser")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json("password incorecct")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRT_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

routers.get("/profile", checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v -password")
    if (!user) return res.status(404).json("user not found")

    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = routers
