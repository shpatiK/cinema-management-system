"use client"
import { Link } from "react-router-dom"
import { FaClock, FaStar } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

interface MovieCardProps {
  id: number
  title: string
  duration: number // Required
  release_year?: number // Optional
  poster_url?: string // Optional
  genre?: string
  rating?: number
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, duration, release_year, poster_url, rating }) => {
  // Format duration from minutes to "1h 56m"
  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    return `${hours}h ${minutes}m`
  }

  const navigate = useNavigate()

  const handleBookNow = () => {
    navigate(`/movies/${id}`)
  }

  // Get the correct poster URL
  const getPosterUrl = () => {
    // Skip if no poster_url exists
    if (!poster_url) return "/placeholder-movie.jpg"

    // Handle full URLs (if any)
    if (poster_url.startsWith("http")) return poster_url

    // Construct correct backend URL
    return `http://localhost:3000/posters/${poster_url}`
  }

  return (
    <div className="block group">
      <div className="relative overflow-hidden rounded-xl shadow-2xl transition-all duration-300 hover:shadow-cinema h-full">
        <Link to={`/movies/${id}`}>
          <img
            src={getPosterUrl() || "/placeholder.svg"}
            alt={`${title} poster`}
            className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              if (!e.currentTarget.src.includes("placeholder")) {
                e.currentTarget.src = "/placeholder-movie.jpg"
              }
            }}
          />
        </Link>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <Link to={`/movies/${id}`}>
            <h3 className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors">{title}</h3>
          </Link>
          <div className="flex items-center space-x-4 text-gray-300 mb-2">
            <span>{release_year || "Year N/A"}</span>
            {rating && (
              <span className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                {rating.toFixed(1)}/10
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3 text-sm mb-4">
            <span className="flex items-center">
              <FaClock className="mr-1" /> {formatDuration(duration)}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleBookNow()
            }}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors duration-300 transform group-hover:translate-y-0 translate-y-10"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default MovieCard











