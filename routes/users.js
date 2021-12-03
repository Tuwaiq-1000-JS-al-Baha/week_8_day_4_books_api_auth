const express = require("express")
const bcrypt = require("bcrypt")

const { User, signupJoi ,loginJoi} = require("../models/User")
const jwt = require("jsonwebtoken")

const checkToken =require("../middleware/checkToken")
const router = express.Router()

router.post("/signup", async (req, res) => {
    try{ const userBody = req.body
        const { firstName, lastName, email, password, avater } = req.body
        const result = signupJoi.validate(userBody)
        if (result.error) return res.status(400).json(result.error.details[0].message)
      
        const userFound = await User.findOne({ email })
        if (userFound) return res.status(400).json("user already registed")
      
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
      
        const UserBody = req.body
        const user = new User({
          firstName,
          lastName,
          password: hash,
          email,
          avater,
        })
      
        await user.save()
        delete user._doc.password
      
        res.json(user)
}catch(error){
res.status(500).send(error.message)
}
})
//--------------------------------------------------login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const result =loginJoi.validate(req.body)
    if (result.error) return res.status(400).json(result.error.details[0].message)
   
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("uesr not found")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json("password incorrect")

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.get("/profile", checkToken,async (req, res) => {
  try {
   

    const user = await User.findById(req.userId).select("-__v -password")
    if (!user) return res.status(404).json("user not found")

    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router