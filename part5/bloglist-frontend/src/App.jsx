import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [notificationMessage, setNotificationMessage] = useState({ message: null, type: null });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      fetchBlogs();
    }
  }, []);

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  };

  const showNotification = (message, type) => {
    setNotificationMessage({ message, type });
    setTimeout(() => {
      setNotificationMessage({ message: null, type: null });
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      console.log(user.token);
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification(`Welcome ${user.name}, you are logged in!`, "success");
      fetchBlogs(); 
    } catch (exception) {
      showNotification("Wrong credentials", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    blogService.setToken(null);
    showNotification("Logged out", "success");
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };

    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setNewTitle("");
      setNewAuthor("");
      setNewUrl("");
      showNotification(`Blog "${returnedBlog.title}" by ${returnedBlog.author} added`, "success");
    } catch (exception) {
      showNotification("Failed to add the blog", "error");
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleBlogSubmit}>
        <div>
          Title:
          <input
            type="text"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  );

  return (
    <div>
      <h2>blogs</h2>

      <Notification
        message={notificationMessage.message}
        type={notificationMessage.type}
      />

      {user === null
        ? loginForm()
        : (
          <div>
            <p>
              {user.name} logged-in
              <button onClick={handleLogout}>
                logout
              </button>
            </p>
            {blogForm()}
            {blogList()}
          </div>
        )}
    </div>
  );
};

export default App;