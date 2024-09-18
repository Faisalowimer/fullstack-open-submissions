const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

// Fetch all users
usersRouter.get("/", async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// Create a new user
usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body

  // Ensure password is provided
  if (!password || password.length < 3) {
    return res.status(400).json({
      error: "Password must be at least 3 characters long",
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({
      error: error.message,
    })
  }
})

module.exports = usersRouter