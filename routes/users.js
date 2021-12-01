const express = require("express")
const bcrypt = require("bcrypt")
const { User, userJoi } = require("../Model/User")
const { json } = require("body-parser")
const jwt = require("jsonwebtoken")
const checkToken = require("../middleware/checkToken")
const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    const userBody = req.body
    const { firstName, lastName, email, password, avatar } = userBody
    const result = userJoi.validate(userBody)
    if (result.error) return res.status(400).json(result.error.details[0].message)

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json("user allredy regester")

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
    if (!user) return res.status(400).json("user not regester")
    const result = await bcrypt.compare(password, user.password)
    if (!result) return res.status(400).json("password is not corect")
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.get("/profile",checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -__v")
    if(!user)return res.status(404).json("user not found")
    res.json(user)
    console.log(decryptedToken)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
module.exports = router
