"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaTimes, FaTicketAlt, FaUser, FaEnvelope, FaPhone, FaCreditCard } from "react-icons/fa"

interface Showtime {
  id: number
  movie_id: number
  cinema: string
  hall: string
  date: string
  time: string
  seats: number
  type: string
  price: number
  movie_title?: string
  poster_url?: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onBookingComplete: (booking: any) => void
  showtime: Showtime | null
  loading?: boolean
}

interface BookingData {
  showtime_id: number
  number_of_tickets: number
  customer_name: string
  customer_email: string
  customer_phone: string
  seat_numbers: string[]
  payment_method: string
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onBookingComplete,
  showtime,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    number_of_tickets: 1,
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    payment_method: "card",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [availableSeats, setAvailableSeats] = useState<number>(0)

  useEffect(() => {
    if (showtime) {
      setAvailableSeats(showtime.seats) // In a real app, you'd fetch actual availability
      // Reset form when showtime changes
      setFormData({
        number_of_tickets: 1,
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        payment_method: "card",
      })
      setSelectedSeats([])
      setErrors({})
    }
  }, [showtime])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Name is required"
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = "Please enter a valid email"
    }

    if (formData.number_of_tickets < 1) {
      newErrors.number_of_tickets = "At least 1 ticket is required"
    } else if (formData.number_of_tickets > availableSeats) {
      newErrors.number_of_tickets = `Only ${availableSeats} seats available`
    } else if (formData.number_of_tickets > 10) {
      newErrors.number_of_tickets = "Maximum 10 tickets per booking"
    }

    if (formData.customer_phone && !/^\+?[\d\s\-$$$$]+$/.test(formData.customer_phone)) {
      newErrors.customer_phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !showtime) {
      return
    }

    const bookingData: BookingData = {
      showtime_id: showtime.id,
      number_of_tickets: formData.number_of_tickets,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      seat_numbers: selectedSeats,
      payment_method: formData.payment_method,
    }

    try {
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const booking = await response.json()
        onBookingComplete(booking)
        onClose()
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || "Failed to create booking" })
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." })
    }
  }

  const totalPrice = showtime ? showtime.price * formData.number_of_tickets : 0

  if (!isOpen || !showtime) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaTicketAlt className="text-blue-600 mr-3 text-xl" />
            <h3 className="text-xl font-bold text-gray-900">Book Tickets</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl" disabled={loading}>
            <FaTimes />
          </button>
        </div>

        {/* Movie & Showtime Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            {showtime.poster_url && (
              <img
                src={showtime.poster_url || "/placeholder.svg"}
                alt={showtime.movie_title}
                className="w-16 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900">{showtime.movie_title}</h4>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                <p>
                  <strong>Cinema:</strong> {showtime.cinema}
                </p>
                <p>
                  <strong>Hall:</strong> {showtime.hall} ({showtime.type})
                </p>
                <p>
                  <strong>Date:</strong> {new Date(showtime.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {showtime.time}
                </p>
                <p>
                  <strong>Price per ticket:</strong> ${showtime.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Number of Tickets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets *</label>
            <select
              value={formData.number_of_tickets}
              onChange={(e) => setFormData({ ...formData, number_of_tickets: Number(e.target.value) })}
              className={`w-full p-3 border rounded-lg ${errors.number_of_tickets ? "border-red-500" : "border-gray-300"}`}
            >
              {[...Array(Math.min(10, availableSeats))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? "Ticket" : "Tickets"}
                </option>
              ))}
            </select>
            {errors.number_of_tickets && <p className="text-red-500 text-xs mt-1">{errors.number_of_tickets}</p>}
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className={`w-full p-3 border rounded-lg ${errors.customer_name ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter your full name"
              />
              {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className={`w-full p-3 border rounded-lg ${errors.customer_email ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter your email"
              />
              {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2" />
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              className={`w-full p-3 border rounded-lg ${errors.customer_phone ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your phone number"
            />
            {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCreditCard className="inline mr-2" />
              Payment Method
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Pay at Counter</option>
            </select>
          </div>

          {/* Total Price */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formData.number_of_tickets} × ${showtime.price.toFixed(2)} per ticket
            </p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{errors.submit}</div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <FaTicketAlt className="mr-2" />
              )}
              {loading ? "Processing..." : "Book Tickets"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
