import { useState } from "react";

const Blog = ({ blog, user, updateBlogLikes, handleDeleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    padding: "15px",
    border: "2px solid #d4d4d4",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    marginBottom: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  };

  const blogHeaderStyle = {
    fontWeight: "bold",
    fontSize: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const detailsStyle = {
    marginTop: "10px",
    paddingLeft: "10px",
    color: "#333",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? { id: blog.user.id, username: blog.user.username, name: blog.user.name } : null, 
    };
    updateBlogLikes(updatedBlog);
  };

  return (
    <div style={blogStyle}>
      <div style={blogHeaderStyle}>
        <span>{blog.title} {blog.author}</span>
        <button style={buttonStyle} onClick={toggleVisibility}>
          {visible ? "hide" : "view"}
        </button>
      </div>

      {visible && (
        <div style={detailsStyle}>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button style={buttonStyle} onClick={handleLike}>like</button>
          </div>
          <div>{blog.user && blog.user.name}</div>
          {user && blog.user && user.username === blog.user.username && (
            <button style={buttonStyle} onClick={() => handleDeleteBlog(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;