const express = require("express")
const router = express.Router()
const { User,userJoi } = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const checkToken = require("../middleware/checkToken")
const checkId = require("../middleware/checkId")

router.post("/signup", async (req, res) => {
  
  try {
    const { firstName, lastName, email, password, avatar } = req.body // م يحتاج نسوي كونست ع طول

    const result = userJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)

    const userFound = await User.findOne({ email }) // نتحقق من تسجيل المستخدم بالايمل
    if (userFound) return res.status(400).send("user already registered")

    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hashSync(password, salt)

    const user = new User({
      firstName,
      lastName,
      email,
      password: hash, //تكون مشفره
      avatar,
    })
    await user.save() //نحفظ في داتا
    delete user._doc.password //يحذف الباسوور بعد ما يحفظ الحساب
    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const result = userJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not found")
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json("password incorrect")
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.get("/profile", checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v -password")
    if (!user) return res.status(400).json("user not found")
    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
module.exports = router
