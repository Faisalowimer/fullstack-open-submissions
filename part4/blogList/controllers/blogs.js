const express = require('express')
const Blog = require('../models/blog')
const blogsRouter = express.Router()

// GET all blogs
blogsRouter.get('/', async (_req, res) => {
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

// DELETE a blog post by id
blogsRouter.delete('/:id', async (req, res) => {
  const blogId = req.params.id
  console.log(`Trying to delete blog with id: ${blogId}`)

  try {
    const deletedBlog = await Blog.findByIdAndDelete(blogId)

    if (deletedBlog) {
      console.log('Blog deleted successfully:', deletedBlog)
      res.status(204).end()  
    } else {
      console.log('Blog not found with id:', blogId)
      res.status(404).json({ error: 'Blog not found' }) 
    }
  } catch (error) {
    console.error('Error deleting blog:', error.message)
    res.status(400).json({ error: 'Invalid blog id' }) 
  }
})

module.exports = blogsRouter