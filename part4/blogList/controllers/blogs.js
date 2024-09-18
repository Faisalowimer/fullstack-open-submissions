const express = require("express")
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const blogsRouter = express.Router()

// Helper function to extract the token
const getTokenFrom = req => {
  const authorization = req.get("authorization")
  if (authorization && authorizationstartsWith("Bearer ")) {
    return authorization.replace("Bearer ", "")
  }
  return null
}

// GET all blogs
blogsRouter.get("/", async (_req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1})
  res.json(blogs)
})

// POST a new blog and assign the logged-in user as the creator
blogsRouter.post("/", async (req, res) => {
  const body = req.body
  const token = getTokenFrom(req)

  // Verify the token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: "Token missing or invalid" })
  }

  // Find the user by ID from the token
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(400).json({ error: "No users found to associate with the blog" })
  }
  
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
blogsRouter.delete("/:id", async (req, res) => {
  const blogId = req.params.id
  console.log(`Trying to delete blog with id: ${blogId}`)

  try {
    const deletedBlog = await Blog.findByIdAndDelete(blogId)

    if (deletedBlog) {
      console.log("Blog deleted successfully:", deletedBlog)
      res.status(204).end()  
    } else {
      console.log("Blog not found with id:", blogId)
      res.status(404).json({ error: "Blog not found" }) 
    }
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