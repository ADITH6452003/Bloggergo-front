import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout()
      navigate('/login')
    }
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">BloggerGo!</Link>
      <div className="nav-links">
        {isLoggedIn ? (
          <div className="menu-container" ref={menuRef}>
            <button onClick={toggleMenu} className="menu-button">
              Menu ▼
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <Link to="/" onClick={closeMenu}>Home</Link>
                <Link to="/my-blogs" onClick={closeMenu}>My Blogs</Link>
                <Link to="/update-profile" onClick={closeMenu}>Update User Details</Link>
                <button onClick={handleLogout} className="dropdown-item">Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar