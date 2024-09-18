const { test, beforeEach, after } = require("node:test")
const assert = require("node:assert").strict
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const api = supertest(app)

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log("clearing database...");

    for (let blog of initialBlogs) {
        console.log("saving blog:", blog.title);
        let blogObject = new Blog(blog)
        await blogObject.save()
    }

    const blogsInDb = await Blog.find({})
    console.log("blogs in DB after setup", blogsInDb.length);
})

test("blogs are returned as json and there are the correct number of them", async () => {
    console.log("starting test fot GET /api/blogs...");
    const response = await api  
        .get("/api/blogs")
        .expect(200)
        .expect("Content-type", /application\/json/)

    console.log("number of blogs returned", response.body.length);
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("blog posts are returned with id instead of _id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  
    const blogs = response.body
  
    blogs.forEach((blog) => {
      assert.strictEqual(blog.id !== undefined, true)    
      assert.strictEqual(blog._id === undefined, true)   
    })
})

test("a valid blog post can be added", async () => {
    const newBlog = {
        title: "Async/Await is the best",
        author: "Faisal Owimer",
        url: "https://faisalOwimer.com/async-await",
        likes: 100
    }

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-type", /application\/json/)

    const blogsAtEnd = await api.get("/api/blogs")
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.body.map(b => b.title)
    assert(titles.includes(newBlog.title))
})

test("a blog post with missing likes defaults to 0", async () => {
    const newBlog = {
      title: "A blog without likes",
      author: "Faisal owimer",
      url: "https://faisalOwimer.com/no-likes"
    }
  
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
  
    const savedBlog = response.body
    assert.strictEqual(savedBlog.likes, 0)
})

test("blog post without title returns 400 Bad Request", async () => {
    const newBlog = {
      author: "Faisal Owimer",
      url: "https://faisalOwimer.com/no-title",
      likes: 4
    }
  
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400) 
})
  
  test("blog post without url returns 400 Bad Request", async () => {
    const newBlog = {
      title: "A blog without URL",
      author: "Faisal Owimer",
      likes: 3
    }
  
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400) 
})

test("a blog post can be deleted", async () => {
    const blogsAtStart = await api.get("/api/blogs")
    const blogToDelete = blogsAtStart.body[0]
    console.log("Blog to delete:", blogToDelete)

  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)  
  
    const blogsAtEnd = await api.get("/api/blogs")
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
  
    const titles = blogsAtEnd.body.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
})

test("a blog post can be updated with new likes", async () => {
    const blogsAtStart = await api.get("/api/blogs")
    const blogToUpdate = blogsAtStart.body[0]
  
    const updatedLikes = { likes: blogToUpdate.likes + 10 }
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikes)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  
    const updatedBlog = response.body
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10)
  })

after(async () => {
    console.log("closing database connection");
    await mongoose.connection.close()
})