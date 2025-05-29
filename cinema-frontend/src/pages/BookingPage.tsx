"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaChair, FaClock, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"
import { PayPalButtons } from "@paypal/react-paypal-js"

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

const BookingPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>()
  const navigate = useNavigate()

  const [movie, setMovie] = useState<Movie | null>(null)
  const [showtime, setShowtime] = useState<Showtime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ticketCount, setTicketCount] = useState<number>(1)
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [seats, setSeats] = useState<Seat[]>([])
  const [availableSeatsCount, setAvailableSeatsCount] = useState<number>(0)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [formValid, setFormValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Try to get movie and showtime from sessionStorage
    const storedMovie = sessionStorage.getItem("selectedMovie")
    const storedShowtime = sessionStorage.getItem("selectedShowtime")

    console.log("Retrieved from sessionStorage:", {
      storedMovie,
      storedShowtime,
      movieId, // Log the URL parameter too
    })

    if (storedMovie && storedShowtime) {
      try {
        const parsedMovie = JSON.parse(storedMovie)
        const parsedShowtime = JSON.parse(storedShowtime)

        console.log("Parsed data:", { parsedMovie, parsedShowtime })

        // Check if the movie ID in the URL matches the stored movie ID
        if (movieId && parsedMovie.id.toString() !== movieId) {
          console.warn("URL movie ID doesn't match stored movie ID")
          // We'll still use the stored data, but log the mismatch
        }

        setMovie(parsedMovie)
        setShowtime(parsedShowtime)

        // Generate seats
        const availableCount = parsedShowtime.seats || 30
        const newSeats = generateSeatsWithAvailability(availableCount)
        setSeats(newSeats)
        setAvailableSeatsCount(availableCount)

        setLoading(false)
      } catch (err) {
        console.error("Error parsing stored data:", err)
        setError("Error loading booking data")
        setLoading(false)
      }
    } else {
      // If no data in sessionStorage, show error
      console.error("No movie or showtime data found in sessionStorage")
      setError("Movie or showtime information is missing")
      setLoading(false)
    }
  }, [movieId])

  // Validate form whenever customer info changes
  useEffect(() => {
    const isValid =
      customerInfo.name.trim() !== "" &&
      customerInfo.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)

    setFormValid(isValid)
  }, [customerInfo])

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.available) return
    const isSelected = selectedSeats.some((s) => s.id === seat.id)
    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id))
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats((prev) => [...prev, seat])
    }
  }

  const calculateTotal = (): number => {
    return selectedSeats.length * (showtime?.price || 0)
  }

  const handleCreateBooking = async (paypalOrderId: string) => {
    try {
      if (!movie || !showtime) {
        console.error("Missing movie or showtime data") // Debug log
        throw new Error("Movie or showtime information is missing")
      }

      // Get auth token if user is logged in
      const token = localStorage.getItem("token")

      console.log("Creating booking with data:", {
        showtime_id: showtime.id,
        movie_id: movie.id,
        number_of_tickets: selectedSeats.length,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        seat_numbers: selectedSeats.map((seat) => seat.id),
        total_price: calculateTotal(),
      }) // Debug log

      const bookingResponse = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          showtime_id: showtime.id,
          movie_id: movie.id,
          number_of_tickets: selectedSeats.length,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone || null,
          seat_numbers: selectedSeats.map((seat) => seat.id),
          payment_method: "paypal",
          payment_status: "completed",
          paypal_order_id: paypalOrderId,
          total_price: calculateTotal(),
        }),
      })

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        console.error("Booking API error:", errorData) // Debug log
        throw new Error(errorData.error || "Failed to create booking")
      }

      const bookingData = await bookingResponse.json()
      console.log("Booking created successfully:", bookingData) // Debug log

      // Clear session storage
      sessionStorage.removeItem("selectedMovie")
      sessionStorage.removeItem("selectedShowtime")

      // Redirect to confirmation page with booking reference
      navigate(`/booking-confirmation/${bookingData.booking_reference}`)
    } catch (error) {
      console.error("Booking creation error:", error)
      alert("There was an error creating your booking. Please try again.")
      throw error
    }
  }

  // Customer info form component
  const CustomerInfoForm = () => (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
      <h4 className="font-semibold mb-3">Customer Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            id="customer-name"
            type="text"
            placeholder="Full Name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="customer-email"
            type="email"
            placeholder="Email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone (optional)
          </label>
          <input
            id="customer-phone"
            type="tel"
            placeholder="Phone Number"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !movie || !showtime) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-4xl font-bold mb-6">Booking Error</h1>
        <p className="text-xl mb-10">{error || "Movie or showtime information is missing."}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Back to Movies
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Tickets for {movie.title}</h1>

      {/* Showtime Information */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Showtime Details</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaCalendarAlt className="text-yellow-500 mr-3" />
                <span>{showtime.date}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="text-yellow-500 mr-3" />
                <span>{showtime.time}</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-yellow-500 mr-3" />
                <div>
                  <p>{showtime.cinema}</p>
                  <p className="text-sm text-gray-600">{showtime.hall}</p>
                </div>
              </div>
              <div>
                <span className="inline-block bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold">
                  {showtime.type}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Select Tickets</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Number of tickets:</label>
              <select
                value={ticketCount}
                onChange={(e) => {
                  setTicketCount(Number.parseInt(e.target.value))
                  setSelectedSeats([])
                }}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} disabled={num > availableSeatsCount}>
                    {num} {num > availableSeatsCount ? "(Not available)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm font-semibold">
              <span
                className={`${availableSeatsCount <= 5 ? "text-red-600" : availableSeatsCount <= 15 ? "text-orange-600" : availableSeatsCount <= 30 ? "text-yellow-600" : "text-green-600"}`}
              >
                {availableSeatsCount} of 70 seats available
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Seat Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Select Your Seats</h2>

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
      </div>

      {/* Payment Section */}
      {selectedSeats.length === ticketCount ? (
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
          <div className="space-y-2 mb-4">
            <p>
              <strong>Movie:</strong> {movie.title}
            </p>
            <p>
              <strong>Showtime:</strong> {showtime.time} - {showtime.date}
            </p>
            <p>
              <strong>Cinema:</strong> {showtime.cinema}
            </p>
            <p>
              <strong>Seats:</strong> {selectedSeats.map((s) => s.id).join(", ")}
            </p>
            <p>
              <strong>Price per ticket:</strong> ${showtime.price}
            </p>
            <p className="text-xl font-bold">
              <strong>Total: ${calculateTotal()}</strong>
            </p>
          </div>

          {/* Customer Information Form */}
          <CustomerInfoForm />

          {/* PayPal Buttons */}
          {formValid && (
            <div className={isSubmitting ? "opacity-50 pointer-events-none" : ""}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                disabled={isSubmitting || !formValid}
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
                    setIsSubmitting(true)
                    // 1. Capture PayPal payment
                    const details = await actions.order.capture()
                    console.log("PayPal payment successful:", details)

                    // 2. Create booking in database
                    await handleCreateBooking(details.id || "unknown-order")
                  } catch (error) {
                    console.error("Payment or booking error:", error)
                    alert("Payment successful but booking failed. Please contact support.")
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                onError={(err) => {
                  console.error("PayPal error:", err)
                  alert("Payment failed. Please try again.")
                  setIsSubmitting(false)
                }}
              />
            </div>
          )}

          {!formValid && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
              Please fill in all required customer information to proceed with payment.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
          <p className="text-yellow-800">
            Please select {ticketCount} seat{ticketCount > 1 ? "s" : ""} to continue with your booking.
          </p>
        </div>
      )}
    </div>
  )
}

export default BookingPage
