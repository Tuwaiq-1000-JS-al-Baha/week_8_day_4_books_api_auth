const express = require("express")
const router = express.Router()
const { User, signupJoi, loginJoi } = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const checkToken = require("../middleware/chekToken")

//------------------------------------------------------------
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, avtar } = req.body
    const result = signupJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)
    const userFound = await User.findOne({ email }) //ابحث في اليوزر اللي عنده الايميل هذا
    if (userFound) return res.status(400).send("user already reqistered")

    const salt = await bcrypt.genSalt(10) //لتشفير الباسورد خلطة ملح يعني
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
//--------------------------------------------login-------------------------------------------------------

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const result = loginJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)

    const user = await User.findOne({ email })
    if (!user) return res.status(404).send("user not registered")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" }) //مفتاح توكن ومدة الباسورد
    res.json(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
//----------------------------------------------profile------------------------------------------------------------------
router.get("/profile", checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v -password")
    if (!user) return res.status(404).send("user not found")
    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
module.exports = router
