const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require("./utils/config")
const logger = require("./utils/logger")
const blogsRouter = require("./controllers/blogs")
const errorHandler = require("./utils/middleware")

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h1>Hellowz</h1>")
})

// Use the blogs router
app.use('/api/blogs', blogsRouter)

// Error handling middleware
app.use(errorHandler)

// Start the server
const PORT = config.PORT
app.listen(PORT, () => {
    logger.info(`Server running on port: http://localhost:${PORT}`)
})