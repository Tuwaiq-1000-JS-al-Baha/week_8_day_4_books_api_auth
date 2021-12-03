const express = require("express")
const router = express.Router()
const { User, signJoi, loginJoi } = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const checktoken = require("../middleware/checktoken")
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body
    const result = signJoi.validate(req.body)
    if (result.error) return res.status(400).json(result.error.details[0].message)
    const userfound = await User.findOne({ email })
    if (userfound) return res.status(404).json("user alrady register")
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
    return res.status(500).json(error.message)
  }
})
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const result = loginJoi.validate(req.body)
    if (result.error) return res.status(400).json(result.error.details[0].message)
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("email not ")
    const vaild = await bcrypt.compare(password, user.password)
    if (!vaild) return res.status(400).json(" password incorrect ")
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
router.get("/profile", checktoken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v -password")
    if (!user) return res.status(404).json("not found ")
    res.json(user)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
module.exports = router
