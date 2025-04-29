import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList'; // Adjusted path
import { fetchMovies } from '../services/api'; // Adjusted path

interface Movie {
  id: number;
  title: string;
  duration: number;
  release_year?: number;
  poster_url?: string;
  genre?: string;
  rating?: number;
}

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };
    loadMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <MovieList movies={movies} />
    </div>
  );
};

export default HomePage;