const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const config = require("./utils/config")
const logger = require("./utils/logger")

const usersRouter = require("./controllers/users")
const blogsRouter = require("./controllers/blogs")
const loginRouter = require("./controllers/login")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/users", usersRouter)
app.use("/api/blogs", blogsRouter)
app.use("/api/login", loginRouter)

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) => logger.error("error connecting to MongoDB:", error.message))

module.exports = app