const express = require('express')
const Blog = require('../models/blog')
const blogsRouter = express.Router()

// GET all blogs
blogsRouter.get('/', (req, res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs)
  })
})

// POST a new blog
blogsRouter.post('/', (req, res) => {
  const blog = new Blog(req.body)

  blog.save().then(result => {
    res.status(201).json(result)
  })
})

module.exports = blogsRouter