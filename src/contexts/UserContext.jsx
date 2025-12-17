import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userDetails, setUserDetails] = useState(null)

  // Check for existing login on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('userDetails')
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUserDetails(userData)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('userDetails')
        localStorage.removeItem('authToken')
      }
    }
  }, [])

  const login = (userData) => {
    setIsLoggedIn(true)
    if (userData) {
      setUserDetails(userData)
      localStorage.setItem('userDetails', JSON.stringify(userData))
    }
  }

  const updateUserDetails = (details) => {
    setUserDetails(details)
    setIsLoggedIn(true)
    localStorage.setItem('userDetails', JSON.stringify(details))
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserDetails(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userDetails')
  }

  const value = {
    isLoggedIn,
    userDetails,
    login,
    updateUserDetails,
    logout
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}