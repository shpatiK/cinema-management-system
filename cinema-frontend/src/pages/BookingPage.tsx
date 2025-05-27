import { useLocation, useNavigate as UseNavigate } from "react-router-dom"
import { useState } from "react"
import { FaArrowLeft, FaCheck } from "react-icons/fa"
import { FaChair as FaChairBooking } from "react-icons/fa"

type SeatBooking = {
  id: string
  row: string
  number: number
  available: boolean
}

type ShowtimeBooking = {
  cinema: string
  time: string
  hall: string
  seats: number
  type: string
  price: number
}

type MovieBooking = {
  id: number
  title: string
  originalTitle: string
  genre: string
  duration: string
  description: string
  releaseDate: string
  rating: number
  actors: string[]
  showtimes: ShowtimeBooking[]
  purchaseNote: string
}

type LocationState = {
  movie: MovieBooking
  showtime: ShowtimeBooking
}

const BookingPage: React.FC = () => {
  const { state } = useLocation() as { state: LocationState }
  const navigate = UseNavigate()
  const { movie, showtime } = state
  const [ticketCount, setTicketCount] = useState<number>(1)
  const [selectedSeats, setSelectedSeats] = useState<SeatBooking[]>([])

  const generateSeats = (): SeatBooking[] => {
    const rows = ["A", "B", "C", "D", "E", "F", "G"]
    const seats: SeatBooking[] = []

    rows.forEach((row) => {
      for (let i = 1; i <= 10; i++) {
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          available: Math.random() > 0.3,
        })
      }
    })

    return seats
  }

  const [seats] = useState<SeatBooking[]>(generateSeats())

  const handleSelectSeat = (seat: SeatBooking) => {
    if (!seat.available) return

    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id))
    } else {
      if (selectedSeats.length < ticketCount) {
        setSelectedSeats([...selectedSeats, seat])
      }
    }
  }

  const handleProceedToPayment = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieTitle: movie.title,
          totalAmount: calculateTotal(),
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url // Shkon direkt te Stripe Checkout
      } else {
        console.error("Stripe session creation failed")
      }
    } catch (error) {
      console.error("Error proceeding to payment", error)
    }
  }

  const calculateTotal = (): number => {
    return selectedSeats.length * showtime.price
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-900 min-h-screen text-white">
      {/* Header Section */}
      <div>
        <button onClick={() => navigate(-1)} className="flex items-center text-yellow-400 mb-6 hover:text-yellow-300">
          <FaArrowLeft className="mr-2" /> Back to movie
        </button>

        <h1 className="text-3xl font-bold mb-2">Select Seats for {movie.title}</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold">{showtime.cinema}</h2>
          <p>
            {showtime.hall} • {showtime.time} • {showtime.type}
          </p>
        </div>
      </div>

      {/* Tickets Selection */}
      <div className="mb-8">
        <label className="block text-lg mb-2">Buy {ticketCount}</label>
        <select
          value={ticketCount}
          onChange={(e) => {
            setTicketCount(Number.parseInt(e.target.value))
            setSelectedSeats([])
          }}
          className="bg-gray-800 text-white p-2 rounded border border-gray-700"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num} className="text-white bg-gray-800">
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Screen Indicator */}
      <div className="bg-gray-700 text-white text-center py-2 mb-6 mx-auto w-full border border-gray-600">SCREEN</div>

      {/* Seat Map */}
      <div className="grid grid-cols-10 gap-2 mb-8">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => handleSelectSeat(seat)}
            disabled={!seat.available}
            className={`p-2 rounded flex flex-col items-center justify-center border border-gray-700
              ${
                selectedSeats.some((s) => s.id === seat.id)
                  ? "bg-yellow-500 text-black"
                  : seat.available
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-900 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <FaChairBooking className={!seat.available ? "text-gray-500" : ""} />
            <span className="text-xs mt-1">{seat.id}</span>
          </button>
        ))}
      </div>

      {/* Seat Legend */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-700 mr-2 rounded border border-gray-600"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-yellow-500 mr-2 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-900 mr-2 rounded border border-gray-600"></div>
          <span>Unavailable</span>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
        <h3 className="font-bold mb-2">Your Selection</h3>
        {selectedSeats.length > 0 ? (
          <div>
            <p>Seats: {selectedSeats.map((s) => s.id).join(", ")}</p>
            <p>Price per ticket: ${showtime.price}</p>
            <p className="font-bold mt-2">Total: ${calculateTotal()}</p>
          </div>
        ) : (
          <p>Please select {ticketCount} seat(s)</p>
        )}
      </div>

      {/* Payment Button */}
      <div className="flex justify-end">
        <button
          onClick={handleProceedToPayment}
          disabled={selectedSeats.length !== ticketCount}
          className={`px-6 py-3 rounded-lg font-bold text-lg flex items-center
            ${
              selectedSeats.length === ticketCount
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-gray-700 text-gray-300 cursor-not-allowed"
            }
          `}
        >
          Proceed to Payment <FaCheck className="ml-2" />
        </button>
      </div>
    </div>
  )
}

export default BookingPage;