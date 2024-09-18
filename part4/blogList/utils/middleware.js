const jwt = require("jsonwebtoken")
const User = require("../models/user")

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === "CastError") {
      return res.status(400).send({ error: "malformatted id" })
    }
  
    next(error)
}

const userExtractor = async (req, res, next) => {
  const token = req.token 

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (decodedToken.id) {
        const user = await User.findById(decodedToken.id)
        req.user = await User.findById(decodedToken.id) 
      }
    } catch (error) {
      return res.status(401).json({ error: "Invalid or missing token" })
    }
  } else {
    return res.status(401).json({ error: "Token missing" })
  }

  next() 
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "")
  } else {
    req.token = null
  }
  next()
}

module.exports = { errorHandler, tokenExtractor, userExtractor } 