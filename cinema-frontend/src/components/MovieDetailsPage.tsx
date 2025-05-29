"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaClock, FaStar, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"

type Seat = {
  id: string
  row: string
  number: number
  available: boolean
}

type Showtime = {
  id: string
  cinema: string
  time: string
  date: string
  hall: string
  seats: number
  type: string
  price: number
}

type Movie = {
  id: number
  title: string
  duration: number
  release_year?: number
  poster_url?: string
  genre?: string
  rating?: number
  description?: string
  director?: string
  actors?: string[]
  showtimes?: Showtime[]
}

// Updated API function to fetch individual movie with showtimes
const fetchMovieById = async (id: string): Promise<Movie> => {
  try {
    console.log("Fetching movie with ID:", id) // Debug log
    const response = await fetch(`http://localhost:3000/api/movies/${id}`)

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText) // Debug log
      throw new Error("Movie not found")
    }

    const movie = await response.json()
    console.log("Movie data received:", movie) // Debug log
    return movie
  } catch (error) {
    console.error("Error fetching movie:", error)
    throw error
  }
}

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) {
        console.error("No movie ID provided") // Debug log
        setError("No movie ID provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log("Fetching movie with ID:", id)

        const movieData = await fetchMovieById(id)
        console.log("Received movie data:", movieData)

        if (!movieData) {
          setError("Movie not found")
          return
        }

        // Ensure showtimes exist
        if (!movieData.showtimes || movieData.showtimes.length === 0) {
          console.warn("Movie has no showtimes:", movieData) // Debug log
          // Add dummy showtimes for testing if needed
          movieData.showtimes = [
            {
              id: "1",
              cinema: "Cinema City",
              time: "19:30",
              date: "2025-05-30",
              hall: "Hall 1",
              seats: 50,
              type: "Standard",
              price: 12.99,
            },
            {
              id: "2",
              cinema: "Cinema City",
              time: "21:45",
              date: "2025-05-30",
              hall: "Hall 2",
              seats: 40,
              type: "IMAX",
              price: 16.99,
            },
          ]
        }

        setMovie(movieData)
      } catch (err) {
        console.error("Failed to load movie:", err)
        setError("Failed to load movie details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadMovie()
  }, [id])

  const handleShowtimeSelect = (showtime: Showtime) => {
    console.log("Selected showtime:", showtime) // Debug log
    console.log("Selected movie:", movie) // Add this to see what movie data is being stored

    if (!movie) {
      console.error("No movie data available")
      return
    }

    // Store the selected showtime in sessionStorage
    sessionStorage.setItem("selectedShowtime", JSON.stringify(showtime))
    sessionStorage.setItem("selectedMovie", JSON.stringify(movie))

    // Log what we're storing in sessionStorage
    console.log("Storing in sessionStorage:", {
      movie: JSON.stringify(movie),
      showtime: JSON.stringify(showtime),
    })

    // Navigate to the booking page with the movie ID
    navigate(`/booking/${movie.id}`)
  }

  const getPosterUrl = () => {
    if (!movie?.poster_url) return "/placeholder.svg?height=600&width=400"
    if (movie.poster_url.startsWith("http")) return movie.poster_url
    return `http://localhost:3000/posters/${movie.poster_url}`
  }

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error || "Movie not found"}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Movie Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Movie Poster */}
        <div className="lg:col-span-1">
          <img
            src={getPosterUrl() || "/placeholder.svg"}
            alt={`${movie.title} poster`}
            className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=600&width=400"
            }}
          />
        </div>

        {/* Movie Information */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center">
                <FaClock className="mr-1" />
                {formatDuration(movie.duration)}
              </span>
              {movie.release_year && (
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  {movie.release_year}
                </span>
              )}
              {movie.rating && (
                <span className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  {movie.rating.toFixed(1)}/10
                </span>
              )}
              {movie.genre && <span className="bg-gray-200 px-2 py-1 rounded">{movie.genre}</span>}
            </div>
          </div>

          {movie.description && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Synopsis</h3>
              <p className="text-gray-700 leading-relaxed">{movie.description}</p>
            </div>
          )}

          {movie.director && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Director</h3>
              <p className="text-gray-700">{movie.director}</p>
            </div>
          )}

          {movie.actors && movie.actors.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.actors.map((actor, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Showtimes Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Select Showtime</h2>
        {movie.showtimes && movie.showtimes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {movie.showtimes.map((showtime) => (
              <div
                key={showtime.id}
                className="border border-gray-300 rounded-lg p-6 hover:border-yellow-500 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleShowtimeSelect(showtime)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{showtime.time}</h3>
                    <p className="text-gray-600">{showtime.date}</p>
                  </div>
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold">
                    {showtime.type}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {showtime.cinema}
                  </p>
                  <p className="font-medium">{showtime.hall}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-2xl font-bold text-gray-900">${showtime.price}</p>
                  <button className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-colors">
                    Select This Showtime
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No showtimes available for this movie.</p>
          </div>
        )}
      </div>

      {/* Purchase Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Please arrive 15 minutes before showtime. Seat availability varies by popularity and
          showtime.
        </p>
      </div>
    </div>
  )
}

export default MovieDetailsPage
