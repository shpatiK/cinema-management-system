"use client"

import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import UserModal from "../components/UserModal"
import MovieModal from "../components/MovieModal"
import LogViewer from "../components/LogViewer" // ADD THIS - Import LogViewer
import {
  fetchAdminMovies,
  createAdminMovie,
  updateAdminMovie,
  deleteAdminMovie,
  type Movie,
  type CreateMovieData,
} from "../services/api"
import {
  FaUsers,
  FaFilm,
  FaChartBar,
  FaCog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserShield,
  FaTicketAlt,
  FaDollarSign,
  FaSync,
  FaClipboardList, // ADD THIS - Icon for logs tab
} from "react-icons/fa"

interface User {
  id: number
  username: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

interface DashboardStats {
  totalUsers: number
  totalMovies: number
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  newUsersToday: number
}

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState<User[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMovies: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    newUsersToday: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: "user" | "movie"; id: number } | null>(null)

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false)
  const [showMovieModal, setShowMovieModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  const navigate = useNavigate()

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      // Fetch users
      const usersResponse = await fetch("http://localhost:3000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData)
      }

      // Fetch movies using the new admin API function
      try {
        const moviesData = await fetchAdminMovies()
        console.log("📊 Admin movies loaded:", moviesData)

        // Debug poster URLs
        moviesData.forEach((movie: Movie) => {
          console.log(`🖼️ Movie: ${movie.title}, Poster URL: ${movie.poster_url}`)
        })

        setMovies(moviesData)
      } catch (movieError) {
        console.error("Error fetching admin movies:", movieError)
      }

      // Update stats
      setStats((prevStats) => ({
        ...prevStats,
        totalUsers: users.length,
        totalMovies: movies.length,
      }))
    } catch (err) {
      console.error("Error fetching admin data:", err)
      setError("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }, [users.length, movies.length])

  const refreshMovies = async () => {
    try {
      console.log("🔄 Refreshing movies...")
      const moviesData = await fetchAdminMovies()
      setMovies(moviesData)
      console.log("✅ Movies refreshed successfully")
    } catch (error) {
      console.error("Error refreshing movies:", error)
      setError("Failed to refresh movies")
    }
  }

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/dashboard")
      return
    }

    fetchAdminData()
  }, [isAuthenticated, user, navigate, fetchAdminData])

  // Helper function to get proper image URL
  const getImageUrl = (posterUrl: string) => {
    if (!posterUrl) {
      return "/placeholder.svg?height=300&width=200"
    }

    // If it's already a full URL, use it as is
    if (posterUrl.startsWith("http://") || posterUrl.startsWith("https://")) {
      return posterUrl
    }

    // If it's a relative path starting with /posters, use the backend URL
    if (posterUrl.startsWith("/posters/")) {
      return `http://localhost:3000${posterUrl}`
    }

    // If it's just a filename, assume it's in the posters directory
    if (!posterUrl.startsWith("/")) {
      return `http://localhost:3000/posters/${posterUrl}`
    }

    // Default case
    return posterUrl
  }

  // User management functions (keeping existing code)
  const handleAddUser = () => {
    setEditingUser(null)
    setShowUserModal(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowUserModal(true)
  }

  const handleSaveUser = async (userData: any) => {
    try {
      setModalLoading(true)
      const token = localStorage.getItem("token")

      let response
      if (editingUser) {
        response = await fetch(`http://localhost:3000/api/admin/users/${editingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        })
      } else {
        response = await fetch("http://localhost:3000/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        })
      }

      if (response.ok) {
        const savedUser = await response.json()

        if (editingUser) {
          setUsers(users.map((u) => (u.id === editingUser.id ? savedUser : u)))
        } else {
          setUsers([savedUser, ...users])
        }

        setShowUserModal(false)
        setEditingUser(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save user")
      }
    } catch (err) {
      setError("Failed to save user")
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId))
        setShowDeleteConfirm(null)
      } else {
        setError("Failed to delete user")
      }
    } catch (err) {
      setError("Failed to delete user")
    }
  }

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}/toggle-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, isActive: !currentStatus } : u)))
      } else {
        setError("Failed to update user status")
      }
    } catch (err) {
      setError("Failed to update user status")
    }
  }

  // Movie management functions
  const handleAddMovie = () => {
    setEditingMovie(null)
    setShowMovieModal(true)
  }

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie)
    setShowMovieModal(true)
  }

  const handleSaveMovie = async (movieData: CreateMovieData) => {
    try {
      setModalLoading(true)

      let savedMovie: Movie
      if (editingMovie) {
        savedMovie = await updateAdminMovie(editingMovie.id, movieData)
        setMovies(movies.map((m) => (m.id === editingMovie.id ? savedMovie : m)))
      } else {
        savedMovie = await createAdminMovie(movieData)
        setMovies([savedMovie, ...movies])
      }

      setShowMovieModal(false)
      setEditingMovie(null)
      await refreshMovies()
    } catch (err: any) {
      console.error("Error saving movie:", err)
      setError(err.response?.data?.error || "Failed to save movie")
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteMovie = async (movieId: number) => {
    try {
      await deleteAdminMovie(movieId)
      setMovies(movies.filter((m) => m.id !== movieId))
      setShowDeleteConfirm(null)
      await refreshMovies()
    } catch (err: any) {
      console.error("Error deleting movie:", err)
      setError(err.response?.data?.error || "Failed to delete movie")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FaUserShield className="mr-3 text-red-500" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Cinema Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshMovies}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center text-sm"
              >
                <FaSync className="mr-2" />
                Refresh Data
              </button>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Administrator</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
            <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <FaUsers className="text-blue-500 text-3xl" />
            </div>
            <p className="text-sm text-green-600 mt-2">+{stats.newUsersToday} today</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Movies</p>
                <p className="text-3xl font-bold text-gray-900">{movies.length}</p>
              </div>
              <FaFilm className="text-purple-500 text-3xl" />
            </div>
            <p className="text-sm text-blue-600 mt-2">Active catalog</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <FaTicketAlt className="text-green-500 text-3xl" />
            </div>
            <p className="text-sm text-green-600 mt-2">This month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
              <FaDollarSign className="text-yellow-500 text-3xl" />
            </div>
            <p className="text-sm text-green-600 mt-2">This month</p>
          </div>
        </div>

        {/* Navigation Tabs - MODIFY THIS to add logs tab */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: FaChartBar },
                { id: "users", label: "User Management", icon: FaUsers },
                { id: "movies", label: "Movie Management", icon: FaFilm },
                { id: "logs", label: "Activity Logs", icon: FaClipboardList }, // ADD THIS - Logs tab
                { id: "settings", label: "Settings", icon: FaCog },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">System Overview</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Recent User Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="font-medium">{users.filter((u) => u.isActive).length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">New Registrations</span>
                        <span className="font-medium text-green-600">+{stats.newUsersToday}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Users</span>
                        <span className="font-medium">{users.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">System Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Server Status</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Online</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Database</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Connected</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Movies in DB</span>
                        <span className="text-sm text-gray-600">{movies.length} movies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
                  <button
                    onClick={handleAddUser}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Add User
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === "admin" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                              className={`${
                                user.isActive
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-900">
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm({ type: "user", id: user.id })}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "movies" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Movie Management</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={refreshMovies}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <FaSync className="mr-2" />
                      Refresh
                    </button>
                    <button
                      onClick={handleAddMovie}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Add Movie
                    </button>
                  </div>
                </div>

                {movies.length === 0 ? (
                  <div className="text-center py-8">
                    <FaFilm className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No movies</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new movie.</p>
                    <div className="mt-6">
                      <button
                        onClick={handleAddMovie}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
                      >
                        <FaPlus className="mr-2" />
                        Add Movie
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies.map((movie) => (
                      <div key={movie.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="relative">
                          <img
                            src={getImageUrl(movie.poster_url) || "/placeholder.svg"}
                            alt={movie.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              console.error(`Failed to load image for ${movie.title}:`, movie.poster_url)
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=300&width=200"
                            }}
                            onLoad={() => {
                              console.log(`✅ Successfully loaded image for ${movie.title}`)
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {movie.release_year}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{movie.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">Director: {movie.director || "Unknown"}</p>
                          <p className="text-sm text-gray-600 mb-3">Duration: {movie.duration || "N/A"} min</p>
                          <div className="text-xs text-gray-400 mb-3">URL: {movie.poster_url}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{movie.release_year}</span>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <FaEye />
                              </button>
                              <button
                                onClick={() => handleEditMovie(movie)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm({ type: "movie", id: movie.id })}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADD THIS - Logs tab content */}
            {activeTab === "logs" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Activity Logs</h3>
                <LogViewer />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">System Settings</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">General Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                        <input
                          type="text"
                          defaultValue="INOX Cinema"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <input
                          type="email"
                          defaultValue="admin@inox.com"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Security Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Enabled</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Auto-backup</span>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Daily</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Session Timeout</span>
                        <span className="text-sm text-gray-600">24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
              <p className="mb-6 break-words whitespace-normal">
                Are you sure you want to delete this {showDeleteConfirm.type}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showDeleteConfirm.type === "user") {
                      handleDeleteUser(showDeleteConfirm.id)
                    } else {
                      handleDeleteMovie(showDeleteConfirm.id)
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Modal */}
        <UserModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false)
            setEditingUser(null)
          }}
          onSave={handleSaveUser}
          user={editingUser}
          loading={modalLoading}
        />

        {/* Movie Modal */}
        <MovieModal
          isOpen={showMovieModal}
          onClose={() => {
            setShowMovieModal(false)
            setEditingMovie(null)
          }}
          onSave={handleSaveMovie}
          movie={editingMovie}
          loading={modalLoading}
        />
      </div>
    </div>
  )
}

export default AdminDashboard
