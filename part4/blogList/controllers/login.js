const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body

  // Find the user by username
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // If user not found or password incorrect, return 401
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "Invalid username or password",
    })
  }

  // Create token payload with username and user ID
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // Generate a token with a secret
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "1h" })

  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter