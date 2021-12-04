const express = require("express")
const { User, userJoi } = require("../models/User")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post("/signup", async (req, res) => {
  try {
    const result = userJoi.validate(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)
    const { firstName, lastName, email, password, avatar } = req.body
    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).send("user already reqistered")

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
    delete user._doc.password // لمن يرسله يحذفه
    res.send(user)
  } catch (error) {
    res.status(500).send("Internal error", error.message)
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const userFound = await User.findOne({ email })
    if (!userFound) return res.status(404).send("user already reqistered")

    const result = await bcrypt.compare(password, userFound.password)
    if (!result) return res.status(400).send("password incorrect")

    const token = jwt.sign({ id: userFound._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.json(token)
  } catch (error) {
    res.status(500).send("Internal error", error.message)
  }
})

router.get("/profile", async (req, res) => {
  try {
    const token = req.header("Authorization")
    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const id = decryptedToken.id
    const userFound = await User.findById(id).select("-__v -password").populate({
      path: "books",
      select: "-__v",
    })

    res.send(userFound)
  } catch (error) {
    res.status(500).send("Internal error", error.message)
  }
})
module.exports = router
