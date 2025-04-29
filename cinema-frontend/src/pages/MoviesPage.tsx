import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { fetchMovies } from '../services/api';

interface Movie {
  id: number;
  title: string;
  duration: number;
  release_year: number;
  poster_url: string;
  rating?: number;
}

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading movies...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Our Movies</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            duration={movie.duration}
            release_year={movie.release_year}
            poster_url={movie.poster_url}
            rating={movie.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;