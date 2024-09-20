import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    type: null,
  });
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const togglableRef = useRef();

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
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
    setBlogs(sortedBlogs);
  };

  const showNotification = (message, type) => {
    setNotificationMessage({ message, type });
    setTimeout(() => {
      setNotificationMessage({ message: null, type: null });
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification("Login successful", "success");
      fetchBlogs();
    } catch (error) {
      showNotification("Login failed: wrong credentials", "error");
    }
  };

  const updateBlogLikes = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog); 
      const updatedBlogs = blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog)); 
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes)); 
    } catch (error) {
      console.error("Failed to update likes", error);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
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
      showNotification(
        `Blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
        "success",
      );
      togglableRef.current.toggleVisibility();
    } catch (error) {
      showNotification("Failed to add the blog", "error");
    }
  };

  const handleDeleteBlog = async (blog) => {
    if (
      window.confirm(`Do you really want to delete the blog "${blog.title}"?`)
    ) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        showNotification(`Blog "${blog.title}" deleted`, "success");
      } catch (error) {
        showNotification("Failed to delete the blog", "error");
      }
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username:
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password:
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );

  const blogForm = () => (
    <Togglable buttonLabel="Create new blog" ref={togglableRef}>
      <form onSubmit={handleBlogSubmit}>
        <div>
          Title:
          <input
            name="title"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
          Author:
          <input
            name="author"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
          URL:
          <input
            name="url"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </Togglable>
  );

  const blogList = () => (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlogLikes={updateBlogLikes}
          handleDeleteBlog={handleDeleteBlog}
        />
      ))}
    </div>
  );

  return (
    <div>
      <h2>Blogs</h2>
      <Notification
        message={notificationMessage.message}
        type={notificationMessage.type}
      />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.name} logged-in
            <button onClick={handleLogout}>Logout</button>
          </p>
          {blogForm()}
          {blogList()}
        </div>
      )}
    </div>
  );
};

export default App;