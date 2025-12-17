import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import './MyBlogs.css'

function MyBlogs() {
  const navigate = useNavigate()
  const { isLoggedIn } = useUser()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingBlog, setEditingBlog] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    
    fetchBlogs()
  }, [isLoggedIn, navigate])

  const fetchBlogs = async () => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
      return
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/blogs/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog._id)
    setEditTitle(blog.title)
    setEditContent(blog.content)
  }

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('authToken')
    
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${editingBlog}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: editTitle, content: editContent })
      })
      
      if (response.ok) {
        setEditingBlog(null)
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return
    
    const token = localStorage.getItem('authToken')
    
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  if (loading) {
    return (
      <div className="my-blogs-page">
        <div className="my-blogs-container">
          <h1>Loading your blogs...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="my-blogs-page">
      <div className="my-blogs-container">
        <h1>My Blogs</h1>
        
        {blogs.length === 0 ? (
          <div className="no-blogs">
            <p>Yet to start your Journey</p>
            <button onClick={() => navigate('/create-blog')} className="start-btn">
              Start Writing
            </button>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map(blog => (
              <div key={blog._id} className="blog-card">
                {editingBlog === blog._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="edit-title"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="edit-content"
                      rows="10"
                    />
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="save-btn">Save</button>
                      <button onClick={() => setEditingBlog(null)} className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{blog.title}</h3>
                    <p className="blog-date">
                      Created: {new Date(blog.createdAt).toLocaleDateString()}
                      {blog.lastUpdated !== blog.createdAt && (
                        <span> | Updated: {new Date(blog.lastUpdated).toLocaleDateString()}</span>
                      )}
                    </p>
                    <p className="blog-preview">{blog.content.substring(0, 150)}...</p>
                    <div className="blog-actions">
                      <button onClick={() => handleEdit(blog)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(blog._id)} className="delete-btn">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBlogs