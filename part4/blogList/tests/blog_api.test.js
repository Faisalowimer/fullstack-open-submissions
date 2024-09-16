const { test, beforeEach, afterEach, after } = require("node:test")
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

afterEach(async () => {
    console.log("closing database connection");
    await mongoose.connection.close()
})