import React from 'react';
import { useParams } from 'react-router-dom';
import { FaClock, FaCalendarAlt, FaTicketAlt, FaStar } from 'react-icons/fa';

const MovieDetailsPage = () => {
  const { id } = useParams(); // Get movie ID from URL
  
  // Mock data for The Godfather - replace with API call
  const movie = {
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
        type: "CLASSIC" 
      },
      { 
        cinema: "INOX PRIZREN", 
        time: "21:15", 
        hall: "SCREEN 3", 
        seats: 32, 
        type: "CLASSIC" 
      },
      { 
        cinema: "INOX PRISHTINA", 
        time: "19:00", 
        hall: "SCREEN 2", 
        seats: 28, 
        type: "PREMIUM" 
      }
    ],
    purchaseNote: "Tickets available online only - no reservations"
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
            <h4 className="text-xl font-semibold mb-2">{showtime.cinema}</h4>
            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-700 p-3 rounded-lg min-w-[200px]">
                <p className="font-bold">{showtime.time}</p>
                <p>{showtime.hall} • {showtime.type}</p>
                <p className="text-yellow-400">{showtime.seats} seats available</p>
                <button className="mt-2 w-full bg-yellow-500 text-black px-4 py-1 rounded font-bold hover:bg-yellow-400 transition-colors">
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
        <h3 className="text-2xl font-bold mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Original Title</h4>
            <p>{movie.originalTitle}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Cast</h4>
            <div className="flex flex-wrap gap-2">
              {movie.actors.map((actor, i) => (
                <span key={i} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
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