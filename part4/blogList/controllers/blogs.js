const express = require('express')
const Blog = require('../models/blog')
const blogsRouter = express.Router()

// GET all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

// POST a new blog
blogsRouter.post('/', async (req, res) => {
  const body = req.body
  
  if (!body.title || !body.url) {
    return res.status(400).json({ error: "Title or URL missing." })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  })
  
  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

module.exports = blogsRouter