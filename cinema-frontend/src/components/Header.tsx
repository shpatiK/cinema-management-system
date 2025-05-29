import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaUser, FaSignOutAlt, FaCog, FaChevronDown } from 'react-icons/fa'
import { useAuthModal } from '../context/AuthModalContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/images/logo.png';




const Header: React.FC = () => {
  const { openModal } = useAuthModal()
  const { user, isAuthenticated, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const handleDashboard = () => {
    setShowUserMenu(false)
    navigate('/dashboard')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-md border-b border-gray-700/50">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-20">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Logo" className="h-20 w-auto" />
      </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/movies" 
              className="text-white hover:text-red-400 transition-colors font-medium"
            >
              MOVIES
            </Link>
            <Link 
              to="/events" 
              className="text-white hover:text-red-400 transition-colors font-medium"
            >
              EVENTS
            </Link>
            <Link 
              to="/cinema" 
              className="text-white hover:text-red-400 transition-colors font-medium"
            >
              CINEMAS
            </Link>
            <Link 
              to="/club" 
              className="text-white hover:text-red-400 transition-colors font-medium"
            >
              CLUB
            </Link>
            <Link 
              to="/rent" 
              className="text-white hover:text-red-400 transition-colors font-medium"
            >
              RENT A HALL
            </Link>
          </nav>

          {/* Right side - Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search movies..."
                className="bg-gray-800/50 text-white placeholder-gray-400 px-4 py-2 pr-10 rounded-full border border-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 w-64"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-full border border-gray-600 transition-colors"
                >
                  <FaUser className="text-white" />
                  <span className="text-white font-medium hidden sm:block">
                    {user?.username}
                  </span>
                  <FaChevronDown className={`text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={handleDashboard}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FaCog className="text-gray-500" />
                      <span>Dashboard</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}

                {/* Click outside to close menu */}
                {showUserMenu && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                )}
              </div>
            ) : (
              <button
                onClick={openModal}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-full transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header