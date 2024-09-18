const express = require("express")
const Blog = require("../models/blog")
const middleware = require("../utils/middleware")

const blogsRouter = express.Router()

// GET all blogs
blogsRouter.get("/", async (_req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1})
  res.json(blogs)
})

// POST a new blog and assign the logged-in user as the creator
blogsRouter.post("/", middleware.userExtractor, async (req, res) => {
  const body = req.body
  const user = req.user
  
  if (!body.title || !body.url) {
    return res.status(400).json({ error: "Title or URL missing." })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })
  
  const savedBlog = await blog.save()

  // Add the blog to the user's blogs list
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

// DELETE a blog post by id
blogsRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
  const blogId = req.params.id
  const user = req.user
  console.log(`Trying to delete blog with id: ${blogId}`)
  
  try {
    const deletedBlog = await Blog.findById(blogId).populate("user")
    console.log("Found blog with user:", deletedBlog.user);

    // If blog not found
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" })
    }

    // Check if the user who created the blog is the one making the request
    if (deletedBlog.user.toString() !== user.id.toString()) {
      return res.status(403).json({ error: "Only the creator can delete this blog" })
    }

    // Delete the blog
    await Blog.findByIdAndDelete(blogId)
    res.status(204).end()
  } catch (error) {
    console.error("Error deleting blog:", error.message)
    res.status(400).json({ error: "Invalid blog id" }) 
  }
})

// UPDATE the number of likes for a blog post
blogsRouter.put("/:id", async (req, res) => {
  const blogId = req.params.id
  const { likes } = req.body

  const updatedBlog = { likes }

  try {
    const result = await Blog.findByIdAndUpdate(blogId, updatedBlog, { new: true })
    if (result) {
      res.json(result)  
    } else {
      res.status(404).json({ error: "Blog not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid blog id" })
  }
})

module.exports = blogsRouter