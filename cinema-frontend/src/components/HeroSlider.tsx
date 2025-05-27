import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaPlay, FaClock, FaStar } from 'react-icons/fa'

interface Movie {
  id: number
  title: string
  duration: number
  release_year?: number
  poster_url?: string
  genre?: string
  rating?: number
  description?: string
}

interface HeroSliderProps {
  movies: Movie[]
}

const HeroSlider: React.FC<HeroSliderProps> = ({ movies }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Get featured movies (first 5 movies for the slider)
  const featuredMovies = movies.slice(0, 5)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || featuredMovies.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredMovies.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    return `${hours}h ${minutes}m`
  }

  const getPosterUrl = (poster_url?: string) => {
    if (!poster_url) return "/placeholder.svg?height=800&width=1200"
    if (poster_url.startsWith("http")) return poster_url
    return `http://localhost:3000/posters/${poster_url}`
  }

  if (featuredMovies.length === 0) {
    return (
      <div className="relative h-screen bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white pt-32">
          <h2 className="text-4xl font-bold mb-4">Welcome to INOX Cinema</h2>
          <p className="text-xl">Discover amazing movies coming soon!</p>
        </div>
      </div>
    )
  }

  // Get current movie for this slide
  const currentMovie = featuredMovies[currentSlide]

  return (
    <div 
      className="relative h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div className="relative h-full">
        {featuredMovies.map((movie, index) => (
          <div
            key={`slide-${movie.id}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image with better positioning for movie posters */}
            <div className="absolute inset-0 flex">
              {/* Left side - Poster */}
              <div className="w-1/2 relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${getPosterUrl(movie.poster_url)})`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover'
                  }}
                />
                {/* Gradient overlay on poster */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/80"></div>
              </div>
              
              {/* Right side - Blurred background extension */}
              <div className="w-1/2 relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm scale-110"
                  style={{
                    backgroundImage: `url(${getPosterUrl(movie.poster_url)})`,
                    backgroundPosition: 'center center',
                  }}
                />
                {/* Strong overlay on blurred side */}
                <div className="absolute inset-0 bg-black/60"></div>
              </div>
            </div>

            {/* Main overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/50"></div>

            {/* Content - positioned on the right side */}
            <div className="relative h-full flex items-center pt-32">
              <div className="container mx-auto px-8 lg:px-16">
                <div className="max-w-2xl text-white ml-auto mr-8">
                  {/* Movie Title */}
                  <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-2xl">
                    {movie.title}
                  </h1>

                  {/* Movie Info */}
                  <div className="flex items-center space-x-6 mb-6 text-lg flex-wrap">
                    <span className="flex items-center drop-shadow-lg">
                      <FaClock className="mr-2" />
                      {formatDuration(movie.duration)}
                    </span>
                    {movie.release_year && (
                      <span className="drop-shadow-lg">{movie.release_year}</span>
                    )}
                    {movie.rating && (
                      <span className="flex items-center drop-shadow-lg">
                        <FaStar className="text-yellow-400 mr-2" />
                        {movie.rating.toFixed(1)}/10
                      </span>
                    )}
                    {movie.genre && (
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {movie.genre}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-lg mb-8 leading-relaxed opacity-90 max-w-xl drop-shadow-lg">
                    {movie.description && movie.description.length > 150 
                      ? `${movie.description.substring(0, 150)}...` 
                      : movie.description || `Experience the incredible story of ${movie.title}. A cinematic masterpiece that will captivate audiences with its stunning visuals and compelling narrative.`
                    }
                  </p>

                  {/* Action Buttons - Using currentMovie to ensure correct ID */}
                  <div className="flex space-x-4">
                    <Link
                      to={`/movies/${currentMovie.id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center text-lg shadow-xl"
                    >
                      <FaPlay className="mr-3" />
                      Book Now
                    </Link>
                    <Link
                      to={`/movies/${currentMovie.id}`}
                      className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg backdrop-blur-sm"
                    >
                      More Info
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-10 backdrop-blur-sm"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-10 backdrop-blur-sm"
          >
            <FaChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-yellow-500 scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Featured Badge */}
      <div className="absolute top-32 left-6 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm z-10 shadow-lg">
        NOW SHOWING
      </div>
    </div>
  )
}

export default HeroSlider
