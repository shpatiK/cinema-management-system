import React from 'react';
import MovieCard from './MovieCard';
import godfather from '../assets/images/godfather.jpg'; 
import inception from '../assets/images/inception.jpg';
import interstellar from '../assets/images/interstellar.jpg';
import shutterisland from '../assets/images/shutterisland.jpg';
import darknight from '../assets/images/darknight.jpg';
import thegreatgatsby from '../assets/images/thegreatgatsby.jpg';

const MovieList = () => {
  const movies = [
    { title: "The Godfather", year: 1972, image: godfather },
    { title: "Inception", year: 2010, image: inception },
    { title: "The Dark Knight", year: 2008, image: darknight },
    { title: "Interstellar", year: 2014, image: interstellar },
    { title: "Shutter Island", year: 2015, image: shutterisland },
    { title: "The Great Gatsby", year: 2013, image: thegreatgatsby }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.title}
          title={movie.title}
          year={movie.year}
          image={movie.image}
        />
      ))}
    </div>
  );
};

export default MovieList;