import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCalendarAlt, FaTicketAlt, FaStar, FaChair, FaCheck, FaTimes } from 'react-icons/fa';

// Define types for our data structures
type Seat = {
  id: string;
  row: string;
  number: number;
  available: boolean;
};

type Showtime = {
  cinema: string;
  time: string;
  hall: string;
  seats: number;
  type: string;
  price: number;
};

type Movie = {
  id: number;
  title: string;
  originalTitle: string;
  genre: string;
  duration: string;
  description: string;
  releaseDate: string;
  rating: number;
  actors: string[];
  showtimes: Showtime[];
  purchaseNote: string;
};

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showSeatSelection, setShowSeatSelection] = useState<boolean>(false);

  // Mock data for The Godfather - replace with API call
  const movie: Movie = {
    id: 1,
    title: "The Godfather",
    originalTitle: "The Godfather",
    genre: "Crime, Drama",
    duration: "2h 55m",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseDate: "24.03.1972",
    rating: 9.2,
    actors: ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall"],
    showtimes: [
      { 
        cinema: "INOX PRIZREN", 
        time: "18:30", 
        hall: "SCREEN 1", 
        seats: 45, 
        type: "CLASSIC",
        price: 8
      },
      { 
        cinema: "INOX PRIZREN", 
        time: "21:15", 
        hall: "SCREEN 3", 
        seats: 32, 
        type: "CLASSIC",
        price: 8
      },
      { 
        cinema: "INOX PRISHTINA", 
        time: "19:00", 
        hall: "SCREEN 2", 
        seats: 28, 
        type: "PREMIUM",
        price: 12
      }
    ],
    purchaseNote: "Tickets available online only - no reservations"
  };

  // Generate seat data with proper typing
  const generateSeats = (): Seat[] => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const seats: Seat[] = [];
    
    rows.forEach(row => {
      for (let i = 1; i <= 10; i++) {
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          available: Math.random() > 0.3 // 70% chance of being available
        });
      }
    });
    
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());

  const handleBuyTickets = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setShowSeatSelection(true);
    setSelectedSeats([]);
    setTicketCount(1);
  };

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.available) return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedShowtime) return;
    
    navigate('/checkout', {
      state: {
        movie,
        showtime: selectedShowtime,
        tickets: selectedSeats.map(seat => ({
          seat: seat.id,
          price: selectedShowtime.price
        })),
        total: selectedSeats.length * selectedShowtime.price
      }
    });
  };

  const calculateTotal = (): number => {
    return selectedSeats.length * (selectedShowtime?.price || 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Seat Selection Modal */}
      {showSeatSelection && selectedShowtime && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
<div className="bg-blue-100 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
<div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Select Seats for {movie.title}</h2>
              <button 
                onClick={() => setShowSeatSelection(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{selectedShowtime.cinema}</p>
                  <p>{selectedShowtime.hall} • {selectedShowtime.time} • {selectedShowtime.type}</p>
                </div>
                <div className="flex items-center">
                  <label className="mr-2">Tickets:</label>
                  <select 
                    value={ticketCount}
                    onChange={(e) => {
                      setTicketCount(parseInt(e.target.value));
                      setSelectedSeats([]);
                    }}
                    className="bg-gray-800 text-white p-2 rounded"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Screen indicator */}
            <div className="bg-gray-700 text-center py-2 mb-6 mx-auto w-3/4">
              SCREEN
            </div>

            {/* Seat map */}
            <div className="grid grid-cols-10 gap-2 mb-8">
              {seats.map(seat => (
                <button
                  key={seat.id}
                  onClick={() => handleSelectSeat(seat)}
                  disabled={!seat.available}
                  className={`p-2 rounded flex flex-col items-center justify-center
                    ${selectedSeats.some(s => s.id === seat.id) 
                      ? 'bg-yellow-500 text-black' 
                      : seat.available 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-red-900 cursor-not-allowed'}
                  `}
                >
                  <FaChair />
                  <span className="text-xs mt-1">{seat.id}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-700 mr-2 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-yellow-500 mr-2 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-900 mr-2 rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>

            {/* Selection summary */}
            <div className="bg-white p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Your Selection</h3>
              {selectedSeats.length > 0 ? (
                <div>
                  <p>Seats: {selectedSeats.map(s => s.id).join(', ')}</p>
                  <p>Price per ticket: ${selectedShowtime.price}</p>
                  <p className="font-bold mt-2">Total: ${calculateTotal()}</p>
                </div>
              ) : (
                <p>Please select {ticketCount} seat(s)</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length !== ticketCount}
                className={`px-6 py-3 rounded-lg font-bold text-lg flex items-center
                  ${selectedSeats.length === ticketCount 
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                    : 'bg-gray-700 cursor-not-allowed'}
                `}
              >
                Proceed to Payment <FaCheck className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-2xl text-gray-300">{movie.genre}</span>
          {movie.rating && (
            <span className="flex items-center bg-yellow-500 text-black px-2 py-1 rounded text-sm">
              <FaStar className="mr-1" /> {movie.rating}/10
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4 text-lg">
          <span className="flex items-center">
            <FaClock className="mr-2" /> {movie.duration}
          </span>
          <span className="flex items-center">
            <FaCalendarAlt className="mr-2" /> {movie.releaseDate}
          </span>
        </div>
      </div>

      {/* Purchase Banner */}
      <div className="bg-yellow-500 text-black p-4 rounded-lg mb-8 font-bold">
        <FaTicketAlt className="inline mr-2" />
        {movie.purchaseNote}
      </div>

      {/* Showtimes */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Showtimes</h3>
        {movie.showtimes.map((showtime, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-xl font-semibold mb-2 text-white">{showtime.cinema}</h4>
            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-700 p-3 rounded-lg min-w-[200px]">
                <p className="font-bold text-white">{showtime.time}</p>
                <p className="text-white">{showtime.hall} • {showtime.type}</p>
                <p className="text-yellow-400">{showtime.seats} seats available</p>
                <p className="text-lg font-semibold my-1 text-white">${showtime.price}</p>
                <button 
                  onClick={() => handleBuyTickets(showtime)}
                  className="mt-2 w-full bg-yellow-500 text-black px-4 py-1 rounded font-bold hover:bg-yellow-400 transition-colors"
                >
                  Buy Tickets
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Movie Details */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Synopsis</h3>
        <p className="text-lg mb-6">{movie.description}</p>
        <button className="text-yellow-400 font-bold flex items-center hover:text-yellow-300 transition-colors">
          Show more <span className="ml-2">↓</span>
        </button>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-2xl font-bold mb-4 text-white">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
          <h4 className="font-semibold mb-2 text-white">Original Title</h4>
<p className="text-white">{movie.originalTitle}</p>
          </div>
          <div>
          <h4 className="font-semibold mb-2 text-white">Cast</h4>
            <div className="flex flex-wrap gap-2">
              {movie.actors.map((actor, i) => (
                <span key={i} className="bg-gray-700 px-3 py-1 rounded-full text-sm text-white">
                {actor}
              </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;