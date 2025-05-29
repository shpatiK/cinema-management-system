import axios from "axios"

const API_BASE_URL = "http://localhost:3000"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

export const fetchMovies = async () => {
  try {
    console.log("🎬 Fetching movies from /api/movies")
    const response = await api.get("/api/movies")
    console.log("🎬 Movies fetched:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching movies:", error)
    throw error
  }
}

// New function to search movies
export const searchMovies = async (query: string) => {
  try {
    console.log(`🔍 Searching movies with query: "${query}"`)
    // If your backend has a search endpoint, use it
    // const response = await api.get(`/api/movies/search?q=${encodeURIComponent(query)}`)

    // Otherwise, fetch all movies and filter client-side
    const response = await api.get("/api/movies")

    // Filter movies by title (case-insensitive)
    const filteredMovies = response.data.filter((movie: any) => movie.title.toLowerCase().includes(query.toLowerCase()))

    console.log(`🔍 Found ${filteredMovies.length} movies matching "${query}"`)
    return filteredMovies
  } catch (error) {
    console.error(`Error searching movies for "${query}":`, error)
    throw error
  }
}

// Admin movie functions
export const fetchAdminMovies = async () => {
  try {
    console.log("🎬 Fetching admin movies from /api/admin/movies")
    const response = await api.get("/api/admin/movies")
    console.log("🎬 Admin movies fetched:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching admin movies:", error)
    throw error
  }
}

export const createAdminMovie = async (movieData: CreateMovieData): Promise<Movie> => {
  try {
    console.log("🎬 Creating movie via admin API:", movieData)
    const response = await api.post("/api/admin/movies", movieData)
    console.log("🎬 Movie created:", response.data)
    return response.data
  } catch (error) {
    console.error("Error creating movie:", error)
    throw error
  }
}

export const updateAdminMovie = async (movieId: number, movieData: Partial<CreateMovieData>): Promise<Movie> => {
  try {
    console.log("🎬 Updating movie via admin API:", movieId, movieData)
    const response = await api.put(`/api/admin/movies/${movieId}`, movieData)
    console.log("🎬 Movie updated:", response.data)
    return response.data
  } catch (error) {
    console.error("Error updating movie:", error)
    throw error
  }
}

export const deleteAdminMovie = async (movieId: number): Promise<{ message: string }> => {
  try {
    console.log("🎬 Deleting movie via admin API:", movieId)
    const response = await api.delete(`/api/admin/movies/${movieId}`)
    console.log("🎬 Movie deleted:", response.data)
    return response.data
  } catch (error) {
    console.error("Error deleting movie:", error)
    throw error
  }
}

// Consistent Movie type definition
export interface Movie {
  id: number
  title: string
  duration?: number
  release_year: number
  poster_url: string
  description?: string
  director?: string
  actors?: string[] | string // Can be array or string
  createdAt?: string
  updatedAt?: string
}

// Type for creating/updating movies
export interface CreateMovieData {
  title: string
  duration?: number
  release_year: number
  poster_url: string
  description?: string
  director?: string
  actors?: string[] | string // Can accept both formats
}

export const login = async (username: string, password: string) => {
  const response = await api.post("/api/auth/login", {
    username,
    password,
  })
  return response.data // Returns { token, user }
}

export const register = async (username: string, password: string, email: string) => {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password,
  })
  return response.data
}

export const verifyAccount = async (token: string) => {
  const response = await api.get("/api/auth/activate", {
    params: { token },
  })
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get("/api/auth/me")
  return response.data
}

export const updateProfile = async (username: string, email: string) => {
  const response = await api.put("/api/auth/update-profile", {
    username,
    email,
  })
  return response.data
}

export default api
