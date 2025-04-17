import React from 'react';
import MovieCard from '../components/MovieCard'; 
import godfather from '../../../assets/images/godfather.jpg';
import inception from '../../../assets/images/inception.jpg';
import interstellar from '../../../assets/images/interstellar.jpg';
import shutterisland from '../../../assets/images/shutterisland.jpg';
import darknight from '../../../assets/images/darknight.jpg';
import thegreatgatsby from '../../../assets/images/thegreatgatsby.jpg';

const HomePage = () => {
  const movies = [
    { id: 1, title: "The Godfather", year: 1972, image: godfather },
    { id: 2, title: "Inception", year: 2010, image: inception },
    { id: 3, title: "The Dark Knight", year: 2008, image: darknight },
    { id: 4, title: "Interstellar", year: 2014, image: interstellar },
    { id: 5, title: "Shutter Island", year: 2015, image: shutterisland },
    { id: 6, title: "The Great Gatsby", year: 2013, image: thegreatgatsby }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">
        <div className="flex flex-wrap justify-center gap-4">
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
      </main>
    </div>
  );
};

export default HomePage;