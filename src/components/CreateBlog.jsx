import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import './CreateBlog.css'

function CreateBlog() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()
  const { isLoggedIn } = useUser()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, navigate])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
      return
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      })
      
      if (response.ok) {
        navigate('/my-blogs')
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to create blog')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="create-blog-page">
      <div className="create-blog-container">
        <h1>Create New Blog</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title"><b>TITLE OF THE BLOG</b></label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">BLOG CONTENT</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            rows={10}
          />
        </div>
        
        <button onClick={handleCreate} className="create-btn" disabled={loading || !title || !content}>
          {loading ? 'Publishing...' : 'Create Blog'}
        </button>
      </div>
    </div>
  )
}

export default CreateBlog