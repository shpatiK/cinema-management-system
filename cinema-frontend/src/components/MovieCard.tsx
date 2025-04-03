import React from 'react';


interface MovieCardProps {
  title: string;
  year: number;
  image: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, year, image }) => {
  return (
    <div className="w-64 rounded-lg overflow-hidden shadow-lg">
      <img 
        src={image} 
        alt={`${title} poster`}
        className="w-full h-80 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600">{year}</p>
      </div>
    </div>
  );
};


export default MovieCard;