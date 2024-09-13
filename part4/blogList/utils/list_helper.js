const _ = require("lodash")

const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => 
    sum + blog.likes, 0
)}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
  
    const favorite = blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max, blogs[0])
    
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
  
    const authorCounts = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(_.keys(authorCounts), author => 
    authorCounts[author]
    )

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
  
    const likeCounts = blogs.reduce((authors, blog) => {
      authors[blog.author] = (authors[blog.author] || 0) + blog.likes
      return authors
    }, {})
  
    const topAuthor = Object.keys(likeCounts).reduce((a, b) => 
    likeCounts[a] > likeCounts[b] ? a : b)
  
    return {
      author: topAuthor,
      likes: likeCounts[topAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}  