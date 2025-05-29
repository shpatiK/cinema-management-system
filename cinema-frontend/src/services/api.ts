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

// Movie functions
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

export const fetchMovieById = async (movieId: string | number) => {
  try {
    console.log(`🎬 Fetching movie ${movieId}`)
    const response = await api.get(`/api/movies/${movieId}`)
    console.log("🎬 Movie fetched:", response.data)
    return response.data
  } catch (error) {
    console.error(`Error fetching movie ${movieId}:`, error)
    throw error
  }
}

// Showtime functions
export const fetchShowtimesByMovie = async (movieId: string | number) => {
  try {
    console.log(`🎭 Fetching showtimes for movie ${movieId}`)
    const response = await api.get(`/api/showtimes/movie/${movieId}`)
    console.log("🎭 Showtimes fetched:", response.data)
    return response.data
  } catch (error) {
    console.error(`Error fetching showtimes for movie ${movieId}:`, error)
    throw error
  }
}

// Search function
export const searchMovies = async (query: string) => {
  try {
    console.log(`🔍 Searching movies with query: "${query}"`)
    const response = await api.get("/api/movies")
    const filteredMovies = response.data.filter((movie: any) => movie.title.toLowerCase().includes(query.toLowerCase()))
    console.log(`🔍 Found ${filteredMovies.length} movies matching "${query}"`)
    return filteredMovies
  } catch (error) {
    console.error(`Error searching movies for "${query}":`, error)
    throw error
  }
}

// Booking functions
export const createBooking = async (bookingData: CreateBookingData) => {
  try {
    console.log("🎫 Creating booking:", bookingData)
    const response = await api.post("/api/bookings", bookingData)
    console.log("🎫 Booking created:", response.data)
    return response.data
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export const getUserBookings = async () => {
  try {
    console.log("🎫 Fetching user bookings")
    const response = await api.get("/api/bookings/my-bookings")
    console.log("🎫 User bookings fetched:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    throw error
  }
}

export const getBookingByReference = async (reference: string) => {
  try {
    console.log(`🎫 Fetching booking by reference: ${reference}`)
    const response = await api.get(`/api/bookings/reference/${reference}`)
    console.log("🎫 Booking fetched:", response.data)
    return response.data
  } catch (error) {
    console.error(`Error fetching booking ${reference}:`, error)
    throw error
  }
}

export const cancelBooking = async (bookingId: number) => {
  try {
    console.log(`🎫 Cancelling booking: ${bookingId}`)
    const response = await api.put(`/api/bookings/${bookingId}/cancel`)
    console.log("🎫 Booking cancelled:", response.data)
    return response.data
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error)
    throw error
  }
}

// Admin booking functions
export const fetchAdminBookings = async (params?: {
  page?: number
  limit?: number
  status?: string
  date?: string
}) => {
  try {
    console.log("🎫 Fetching admin bookings")
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.status) queryParams.append("status", params.status)
    if (params?.date) queryParams.append("date", params.date)

    const response = await api.get(`/api/admin/bookings?${queryParams.toString()}`)
    console.log("🎫 Admin bookings fetched:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching admin bookings:", error)
    throw error
  }
}

export const updateBookingStatus = async (bookingId: number, status: string) => {
  try {
    console.log(`🎫 Updating booking ${bookingId} status to ${status}`)
    const response = await api.put(`/api/admin/bookings/${bookingId}/status`, { status })
    console.log("🎫 Booking status updated:", response.data)
    return response.data
  } catch (error) {
    console.error(`Error updating booking ${bookingId} status:`, error)
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

// Type definitions
export interface Movie {
  id: number
  title: string
  duration?: number
  release_year: number
  poster_url: string
  description?: string
  director?: string
  actors?: string[] | string
  createdAt?: string
  updatedAt?: string
}

export interface CreateMovieData {
  title: string
  duration?: number
  release_year: number
  poster_url: string
  description?: string
  director?: string
  actors?: string[] | string
}

export interface Showtime {
  id: number
  movie_id: number
  cinema: string
  hall: string
  date: string
  time: string
  seats: number
  type: string
  price: number
}

export interface CreateBookingData {
  showtime_id: number
  number_of_tickets: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  seat_numbers?: string[]
  payment_method?: string
}

export interface Booking {
  id: number
  user_id: number
  showtime_id: number
  booking_reference: string
  number_of_tickets: number
  total_price: number
  booking_status: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  seat_numbers?: string
  payment_method: string
  payment_status: string
  booking_date: string
  created_at: string
  updated_at: string
  // Joined fields
  movie_title?: string
  poster_url?: string
  cinema?: string
  hall?: string
  showtime_date?: string
  showtime_time?: string
  screen_type?: string
}

// Auth functions
export const login = async (username: string, password: string) => {
  const response = await api.post("/api/auth/login", {
    username,
    password,
  })
  return response.data
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
