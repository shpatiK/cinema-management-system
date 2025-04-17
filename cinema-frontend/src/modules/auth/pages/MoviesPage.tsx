import React from 'react';
import MovieCard from '../components/MovieCard'; 
import godfather from '../../../assets/images/godfather.jpg';
import inception from '../../../assets/images/inception.jpg';
import interstellar from '../../../assets/images/interstellar.jpg';
import shutterisland from '../../../assets/images/shutterisland.jpg';
import darknight from '../../../assets/images/darknight.jpg';
import thegreatgatsby from '../../../assets/images/thegreatgatsby.jpg';

const MoviesPage = () => {
  const movies = [
    { id: 1, title: "The Godfather", year: 1972, image: godfather },
    { id: 2, title: "Inception", year: 2010, image: inception },
    { id: 3, title: "The Dark Knight", year: 2008, image: darknight },
    { id: 4, title: "Interstellar", year: 2014, image: interstellar },
    { id: 5, title: "Shutter Island", year: 2015, image: shutterisland },
    { id: 6, title: "The Great Gatsby", year: 2013, image: thegreatgatsby }
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Our Movies</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            year={movie.year}
            image={movie.image}
          />
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;