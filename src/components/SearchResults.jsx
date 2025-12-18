import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import './SearchResults.css'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { userDetails } = useUser()
  const navigate = useNavigate()
  const query = searchParams.get('q')

  useEffect(() => {
    const searchBlogs = async () => {
      if (!query) return
      
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/search?query=${encodeURIComponent(query)}`
        if (response.ok) {
          const data = await response.json()
          setBlogs(data)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    searchBlogs()
  }, [query])

  const handleReadBlog = (blog) => {
    navigate(`/read-blog/${blog._id}`)
  }

  if (loading) {
    return (
      <div className="search-results-container">
        <h1>Searching...</h1>
      </div>
    )
  }

  return (
    <div className="search-results-container">
      <h1>Search Results for "{query}"</h1>
      
      {blogs.length === 0 ? (
        <div className="no-results">
          <p>No blogs found for "{query}"</p>
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map(blog => (
            <div key={blog._id} className="blog-card">
              <div className="blog-header">
                <h3>{blog.title}</h3>
                <span className="author-name">by {blog.author.username}</span>
              </div>
              <p className="blog-preview">{blog.content.substring(0, 150)}...</p>
              <div className="blog-footer">
                <span className="blog-date">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                {blog.author._id !== userDetails?.id && (
                  <button 
                    onClick={() => handleReadBlog(blog)} 
                    className="read-btn"
                  >
                    Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults