import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FaChair, FaTimes, FaClock, FaStar, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"

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

// Function to get urgency message based on available seats
const getUrgencyMessage = (seats: number) => {
  if (seats <= 5) {
    return {
      message: "Almost Sold Out – Secure Your Seat Today!",
      bgColor: "bg-red-500",
      textColor: "text-white"
    }
  } else if (seats <= 15) {
    return {
      message: "Hurry! Only a Few Seats Left!",
      bgColor: "bg-orange-500",
      textColor: "text-white"
    }
  } else if (seats <= 30) {
    return {
      message: "Limited Seats Available",
      bgColor: "bg-yellow-500",
      textColor: "text-black"
    }
  } else {
    return {
      message: "Good Availability",
      bgColor: "bg-green-500",
      textColor: "text-white"
    }
  }
}

// Function to get specific seat availability based on movie ID and showtime
const getMovieAvailability = (movieId: number, showtimeId: string): number => {
  // Create specific availability patterns for different movies
  const availabilityPatterns: { [key: string]: number } = {
    // Movie ID 1 - Very popular (less than 5 seats)
    "1-1": 3,
    "1-2": 2,
    "1-3": 4,
    
    // Movie ID 2 - Popular (around 15 seats)
    "2-1": 12,
    "2-2": 15,
    "2-3": 8,
    
    // Movie ID 3 - Moderate popularity (around 30 seats)
    "3-1": 28,
    "3-2": 32,
    "3-3": 25,
    
    // Movie ID 4 - Good availability (around 50 seats)
    "4-1": 48,
    "4-2": 52,
    "4-3": 45,
    
    // Movie ID 5 - Mixed availability
    "5-1": 5,  // Almost sold out
    "5-2": 35, // Good availability
    "5-3": 18, // Limited
    
    // Movie ID 6 - Weekend vs weekday pattern
    "6-1": 7,  // Weekend - popular
    "6-2": 42, // Weekday - good availability
    "6-3": 22, // Evening - moderate
    
    // Movie ID 7 - New release pattern
    "7-1": 1,  // Opening night - almost sold out
    "7-2": 6,  // Prime time - very limited
    "7-3": 38, // Matinee - good availability
  }
  
  const key = `${movieId}-${showtimeId}`
  
  // If we have a specific pattern, use it
  if (availabilityPatterns[key]) {
    return availabilityPatterns[key]
  }
  
  // Fallback: generate based on movie ID for consistency
  const movieSeed = movieId % 4
  switch (movieSeed) {
    case 0: return Math.floor(Math.random() * 5) + 1  // 1-5 seats
    case 1: return Math.floor(Math.random() * 10) + 10 // 10-20 seats
    case 2: return Math.floor(Math.random() * 15) + 25 // 25-40 seats
    case 3: return Math.floor(Math.random() * 20) + 45 // 45-65 seats
    default: return 30
  }
}

// Function to generate seats based on available count
const generateSeatsWithAvailability = (availableCount: number): Seat[] => {
  const rows = ["A", "B", "C", "D", "E", "F", "G"]
  const totalSeats = 70 // 7 rows × 10 seats
  const seats: Seat[] = []
  
  // Create all seats first
  rows.forEach((row) => {
    for (let i = 1; i <= 10; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        available: false, // Start with all unavailable
      })
    }
  })
  
  // Randomly make the specified number of seats available
  const shuffledSeats = [...seats].sort(() => Math.random() - 0.5)
  for (let i = 0; i < Math.min(availableCount, totalSeats); i++) {
    shuffledSeats[i].available = true
  }
  
  return seats
}

// Updated API function to fetch individual movie with showtimes
const fetchMovieById = async (id: string): Promise<Movie> => {
  try {
    const response = await fetch(`http://localhost:3000/api/movies/${id}`)
    if (!response.ok) {
      throw new Error("Movie not found")
    }
    const movie = await response.json()
    return movie
  } catch (error) {
    console.error("Error fetching movie:", error)
    throw error
  }
}

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null)
  const [ticketCount, setTicketCount] = useState<number>(1)
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [showSeatSelection, setShowSeatSelection] = useState<boolean>(false)
  const [seats, setSeats] = useState<Seat[]>([])
  const [availableSeatsCount, setAvailableSeatsCount] = useState<number>(0)

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        console.log("Fetching movie with ID:", id)

        const movieData = await fetchMovieById(id)
        console.log("Received movie data:", movieData)

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

  // Generate seats when showtime is selected
  useEffect(() => {
    if (selectedShowtime && movie) {
      const availableCount = getMovieAvailability(movie.id, selectedShowtime.id)
      const newSeats = generateSeatsWithAvailability(availableCount)
      setSeats(newSeats)
      setAvailableSeatsCount(availableCount)
      setSelectedSeats([]) // Clear previously selected seats
    }
  }, [selectedShowtime, movie])

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.available) return
    const isSelected = selectedSeats.some((s) => s.id === seat.id)
    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id))
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats((prev) => [...prev, seat])
    }
  }

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime)
    setShowSeatSelection(true)
    setSelectedSeats([])
  }

  const calculateTotal = (): number => {
    return selectedSeats.length * (selectedShowtime?.price || 0)
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
            {movie.showtimes.map((showtime) => {
              const availableSeats = getMovieAvailability(movie.id, showtime.id)
              const urgency = getUrgencyMessage(availableSeats)
              
              return (
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
                    <p className="text-sm font-semibold text-gray-700">
                      {availableSeats} seats available
                    </p>
                  </div>

                  {/* Urgency message based on specific availability */}
                  <div className="mb-4">
                    <span className={`${urgency.bgColor} ${urgency.textColor} px-3 py-1 rounded-full text-xs font-semibold`}>
                      {urgency.message}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">${showtime.price}</p>
                    <button className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-colors">
                      Select This Showtime
                    </button>
                  </div>
                </div>
              )
            })}
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
          <strong>Note:</strong> Please arrive 15 minutes before showtime. Seat availability varies by popularity and showtime.
        </p>
      </div>

      {/* Seat Selection Modal */}
      {showSeatSelection && selectedShowtime && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Select Seats for {movie.title}</h2>
              <button onClick={() => setShowSeatSelection(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-lg font-semibold">{selectedShowtime.cinema}</p>
                  <p className="text-gray-600">
                    {selectedShowtime.hall} • {selectedShowtime.time} • {selectedShowtime.type}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    <span className={`${availableSeatsCount <= 5 ? 'text-red-600' : availableSeatsCount <= 15 ? 'text-orange-600' : availableSeatsCount <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {availableSeatsCount} of 70 seats available
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <label className="block text-sm font-medium mb-1">Number of tickets:</label>
                  <select
                    value={ticketCount}
                    onChange={(e) => {
                      setTicketCount(Number.parseInt(e.target.value))
                      setSelectedSeats([])
                    }}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num} disabled={num > availableSeatsCount}>
                        {num} {num > availableSeatsCount ? '(Not available)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Screen */}
            <div className="bg-gray-800 text-white text-center py-3 mb-6 rounded">SCREEN</div>

            {/* Seat Map */}
            <div className="grid grid-cols-10 gap-2 mb-6">
              {seats.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => handleSelectSeat(seat)}
                  disabled={!seat.available}
                  className={`p-2 rounded flex flex-col items-center justify-center border
                    ${
                      selectedSeats.some((s) => s.id === seat.id)
                        ? "bg-yellow-500 text-black border-yellow-600"
                        : seat.available
                          ? "bg-gray-100 hover:bg-gray-200 border-gray-300"
                          : "bg-red-100 text-red-400 cursor-not-allowed border-red-200"
                    }
                  `}
                >
                  <FaChair />
                  <span className="text-xs mt-1">{seat.id}</span>
                </button>
              ))}
            </div>

            {/* Seat Legend */}
            <div className="flex justify-center gap-6 mb-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 mr-2 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 mr-2 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-red-200 mr-2 rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>

            {/* Payment Section */}
            {selectedSeats.length === ticketCount && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                <div className="space-y-2 mb-4">
                  <p>
                    <strong>Movie:</strong> {movie.title}
                  </p>
                  <p>
                    <strong>Showtime:</strong> {selectedShowtime.time} - {selectedShowtime.date}
                  </p>
                  <p>
                    <strong>Cinema:</strong> {selectedShowtime.cinema}
                  </p>
                  <p>
                    <strong>Seats:</strong> {selectedSeats.map((s) => s.id).join(", ")}
                  </p>
                  <p>
                    <strong>Price per ticket:</strong> ${selectedShowtime.price}
                  </p>
                  <p className="text-xl font-bold">
                    <strong>Total: ${calculateTotal()}</strong>
                  </p>
                </div>

                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: calculateTotal().toFixed(2),
                          },
                          description: `Tickets for ${movie.title}`,
                        },
                      ],
                    })
                  }}
                  onApprove={async (data, actions) => {
                    if (!actions.order) {
                      throw new Error("Order actions not available")
                    }

                    try {
                      const details = await actions.order.capture()
                      alert(`Payment successful! Thank you, ${details.payer?.name?.given_name || "customer"}`)
                      setShowSeatSelection(false)
                    } catch (error) {
                      console.error("Payment capture error:", error)
                      alert("Payment failed. Please try again.")
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetailsPage