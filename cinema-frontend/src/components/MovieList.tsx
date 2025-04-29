import React from 'react';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  duration: number;
  release_year?: number;
  poster_url?: string;
  genre?: string;
  rating?: number;
}

const MovieList = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          duration={movie.duration} // Now required
          release_year={movie.release_year}
          poster_url={movie.poster_url}
          genre={movie.genre}
          rating={movie.rating}
        />
      ))}
    </div>
  );
};

export default MovieList;