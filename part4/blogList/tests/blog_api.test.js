const { test, beforeEach, describe, after } = require("node:test")
const assert = require("node:assert").strict
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const User = require("../models/user")
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
    await User.deleteMany({})
    console.log("clearing database...");

    const passwordHash = await bcrypt.hash("password123", 10)
    const user = new User({ username: "existingUser", passwordHash })
    await user.save()

    for (let blog of initialBlogs) {
        console.log("saving blog:", blog.title);
        let blogObject = new Blog({ ...blog, user: user._id })
        await blogObject.save()
    }

    const blogsInDb = await Blog.find({}).populate("user", { username: 1 })
    console.log("blogs in DB after setup", blogsInDb);
})

const getToken = async () => {
    const user = await User.findOne({ username: "existingUser" })
    const userForToken = { username: user.username, id: user._id }
    return jwt.sign(userForToken, process.env.SECRET)
}

test("blogs are returned as json and there are the correct number of them", async () => {
    console.log("starting test fot GET /api/blogs...");
    
    const token = await getToken()
    
    const response = await api  
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-type", /application\/json/)

    console.log("number of blogs returned", response.body.length);
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("blog posts are returned with id instead of _id", async () => {
    const token = await getToken()
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  
    const blogs = response.body
  
    blogs.forEach((blog) => {
      assert.strictEqual(blog.id !== undefined, true)    
      assert.strictEqual(blog._id === undefined, true)   
    })
})

test("a valid blog post can be added with a valid token", async () => {
    const token = await getToken()
    
    const newBlog = {
        title: "Async/Await is the best",
        author: "Faisal Owimer",
        url: "https://faisalOwimer.com/async-await",
        likes: 100
    }

    await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-type", /application\/json/)

    const blogsAtEnd = await api.get("/api/blogs")
        .set("Authorization", `Bearer ${token}`)

        assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.body.map(b => b.title)
    assert(titles.includes(newBlog.title))
})

test("adding a blog fails with status code 401 if no token is provided", async () => {
    const newBlog = {
        title: "A blog without a token",
        author: "Unauthorized User",
        url: "https://unauthorized.com",
        likes: 1
    }

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-type", /application\/json/)

    const blogsAtEnd = await api.get("/api/blogs")
        .set("Authorization", `Bearer ${await getToken()}`)
        
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
})

test("a blog post with missing likes defaults to 0", async () => {
    const token = await getToken()
    
    const newBlog = {
      title: "A blog without likes",
      author: "Faisal owimer",
      url: "https://faisalOwimer.com/no-likes"
    }
  
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
  
    const savedBlog = response.body
    assert.strictEqual(savedBlog.likes, 0)
})

test("blog post without title returns 400 Bad Request", async () => {
    const token = await getToken()
    
    const newBlog = {
      author: "Faisal Owimer",
      url: "https://faisalOwimer.com/no-title",
      likes: 4
    }
  
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400) 
      .expect("Content-type", /application\/json/)
})
  
  test("blog post without url returns 400 Bad Request", async () => {
    const token = await getToken()

    const newBlog = {
      title: "A blog without URL",
      author: "Faisal Owimer",
      likes: 3
    }
  
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400) 
      .expect("Content-type", /application\/json/)
})

test("a blog post can be deleted", async () => {
    const token = await getToken()
    
    const blogsAtStart = await api.get("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-type", /application\/json/)

    const blogToDelete = blogsAtStart.body[0]
    console.log("Blog to delete:", blogToDelete)

    assert(blogToDelete.user, "Blog should have associated user")
    assert.strictEqual(blogToDelete.user.username, "existingUser")

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)  
      .expect("Content-type", /application\/json/)
  
    const blogsAtEnd = await api.get("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-type", /application\/json/)

    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
  
    const titles = blogsAtEnd.body.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
})

test("a blog post can be updated with new likes", async () => {
    const token = await getToken()
    
    const blogsAtStart = await api.get("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
    const blogToUpdate = blogsAtStart.body[0]
  
    const updatedLikes = { likes: blogToUpdate.likes + 10 }
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedLikes)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  
    const updatedBlog = response.body
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10)
  })

beforeEach(async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash("password123", 10)
    const user = new User({ username: "existingUser", passwordHash })
  
    await user.save()
})
  
describe("creating a new user", () => {
    test("succeeds with a fresh valid username and password", async () => {
      const newUser = {
        username: "validUser",
        name: "Valid User",
        password: "password123",
        }
  
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/)
  
      const usersAtEnd = await User.find({})
      assert.strictEqual(usersAtEnd.length, 2)
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
  
    test("fails with 400 if username is shorter than 3 characters", async () => {
      const newUser = {
        username: "ab",
        name: "Invalid User",
        password: "password123",
      }
  
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)
  
      assert.strictEqual(response.body.error, "Username must be at least 3 characters long")
    })
  
    test("fails with 400 if password is shorter than 3 characters", async () => {
      const newUser = {
        username: "validUser",
        name: "Valid User",
        password: "pw",
      }
  
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)
  
      assert.strictEqual(response.body.error, "Password must be at least 3 characters long")
    })
  
    test("fails with 400 if username already exists", async () => {
      const newUser = {
        username: "existingUser",
        name: "Duplicate User",
        password: "password123",
      }
  
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)
  
      assert.strictEqual(response.body.error, "Username must be unique")
    })
  })

after(async () => {
    console.log("closing database connection");
    await mongoose.connection.close()
})