import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaStar } from 'react-icons/fa';

interface MovieCardProps {
  id: number; // Added ID for routing
  title: string;
  year: number;
  image: string;
  duration?: string; // New from screenshot
  genre?: string; // New from screenshot
  rating?: number; // Optional rating
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  id, 
  title, 
  year, 
  image, 
  duration = "1h 56m", 
  genre = "Aksion, Triller",
  rating 
}) => {
  return (
    <Link to={`/movies/${id}`} className="block group">
      <div className="relative overflow-hidden rounded-xl shadow-2xl transition-all duration-300 hover:shadow-cinema h-full">
        {/* Movie Image */}
        <img 
          src={image} 
          alt={title}
          className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          {/* Movie Title */}
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          
          {/* Movie Metadata */}
          <div className="flex items-center space-x-4 text-gray-300 mb-2">
            <span>{year}</span>
            {rating && (
              <span className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                {rating}/10
              </span>
            )}
          </div>
          
          {/* Additional Info from Screenshot */}
          <div className="flex items-center space-x-3 text-sm mb-4">
            <span className="flex items-center">
              <FaClock className="mr-1" /> {duration}
            </span>
            <span>{genre}</span>
          </div>
          
          {/* Action Button */}
          <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors duration-300 transform group-hover:translate-y-0 translate-y-10">
            Book Now
          </button>
        </div>
        
        {/* Top Right Badge (Optional) */}
        {rating && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm">
            {rating}/10
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;