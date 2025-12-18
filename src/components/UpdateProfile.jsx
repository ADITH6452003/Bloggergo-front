import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import API_BASE_URL from '../config/api'
import './UpdateProfile.css'

function UpdateProfile() {
  const [username, setUsername] = useState('')
  const [mobile, setMobile] = useState('')
  const [dob, setDob] = useState('')
  const navigate = useNavigate()
  const { isLoggedIn, userDetails, updateUserDetails } = useUser()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, navigate])

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || '')
      setMobile(userDetails.mobile || '')
      setDob(userDetails.dob || '')
    }
  }, [userDetails])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
      return
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, mobile, dob })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        updateUserDetails(data.user)
        setSuccess('Profile updated successfully!')
        setTimeout(() => navigate('/'), 2000)
      } else {
        setError(data.message || 'Update failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="update-profile-page">
      <div className="update-profile-container">
        <h1>Update Profile</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="update-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile