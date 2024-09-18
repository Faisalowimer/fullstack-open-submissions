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

  // Validate username and password length
  if (!username || username.length < 3) {
    return res.status(400).json({
      error: "Username must be at least 3 characters long",
    })
  }

  // Ensure password is provided
  if (!password || password.length < 3) {
    return res.status(400).json({
      error: "Password must be at least 3 characters long",
    })
  }

  // Check if the username is unique
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({
      error: "Username must be unique",
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