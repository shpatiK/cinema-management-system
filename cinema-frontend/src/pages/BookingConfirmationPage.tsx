"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaCheckCircle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaUser, FaEnvelope } from "react-icons/fa"

interface BookingDetails {
  id: number
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
  movie_title: string
  cinema: string
  hall: string
  showtime_time: string
  showtime_date: string
  screen_type: string
}

const BookingConfirmationPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      if (!reference) {
        setError("No booking reference provided")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:3000/api/bookings/reference/${reference}`)

        if (!response.ok) {
          throw new Error("Booking not found")
        }

        const bookingData = await response.json()
        setBooking(bookingData)
      } catch (err) {
        console.error("Error fetching booking:", err)
        setError("Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [reference])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Error</h1>
          <p className="text-gray-600 mb-6">{error || "Booking not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Movies
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const seatNumbers = booking.seat_numbers ? JSON.parse(booking.seat_numbers) : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-4">Your tickets have been successfully booked.</p>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="text-2xl font-bold text-gray-900">{booking.booking_reference}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Movie & Showtime Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Movie & Showtime Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.movie_title}</h3>
                <span className="inline-block bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold mt-1">
                  {booking.screen_type}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-3 text-yellow-500" />
                <div>
                  <p className="font-medium">{booking.cinema}</p>
                  <p className="text-sm">{booking.hall}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-3 text-yellow-500" />
                <p>{formatDate(booking.showtime_date)}</p>
              </div>

              <div className="flex items-center text-gray-600">
                <FaClock className="mr-3 text-yellow-500" />
                <p>{formatTime(booking.showtime_time)}</p>
              </div>

              <div className="flex items-center text-gray-600">
                <FaTicketAlt className="mr-3 text-yellow-500" />
                <div>
                  <p>{booking.number_of_tickets} ticket(s)</p>
                  {seatNumbers.length > 0 && <p className="text-sm">Seats: {seatNumbers.join(", ")}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Payment Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Customer & Payment Details</h2>

            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <FaUser className="mr-3 text-yellow-500" />
                <p>{booking.customer_name}</p>
              </div>

              <div className="flex items-center text-gray-600">
                <FaEnvelope className="mr-3 text-yellow-500" />
                <p>{booking.customer_email}</p>
              </div>

              {booking.customer_phone && (
                <div className="flex items-center text-gray-600">
                  <span className="mr-3 text-yellow-500">📞</span>
                  <p>{booking.customer_phone}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{booking.payment_method}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Payment Status:</span>
                  <span
                    className={`font-medium capitalize ${
                      booking.payment_status === "completed" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {booking.payment_status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>${booking.total_price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Please arrive at the cinema at least 15 minutes before showtime</li>
            <li>• Bring a valid ID for verification if required</li>
            <li>
              • Your booking reference is: <strong>{booking.booking_reference}</strong>
            </li>
            <li>• Screenshots of this confirmation can be used as proof of purchase</li>
            <li>• For any issues, contact cinema support with your booking reference</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={() => window.print()}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Print Confirmation
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Movies
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmationPage
