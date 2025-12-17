import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import UserInfo from './components/UserInfo'
import CreateBlog from './components/CreateBlog'
import MyBlogs from './components/MyBlogs'
import UpdateProfile from './components/UpdateProfile'
import SearchResults from './components/SearchResults'
import './App.css'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
            </>
          } />
          <Route path="/create-blog" element={
            <>
              <Navbar />
              <CreateBlog />
            </>
          } />
          <Route path="/my-blogs" element={
            <>
              <Navbar />
              <MyBlogs />
            </>
          } />
          <Route path="/update-profile" element={
            <>
              <Navbar />
              <UpdateProfile />
            </>
          } />
          <Route path="/search" element={
            <>
              <Navbar />
              <SearchResults />
            </>
          } />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
