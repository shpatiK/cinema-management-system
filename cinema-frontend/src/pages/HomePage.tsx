import { useState, useEffect } from "react"
import MovieList from "../components/MovieList"
import HeroSlider from "../components/HeroSlider"
import { fetchMovies } from "../services/api"

interface MovieProps {
  id: number
  title: string
  duration: number
  release_year?: number
  poster_url?: string
  genre?: string
  rating?: number
  description?: string
}

const HomePage = () => {
  const [movies, setMovies] = useState<MovieProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        const data = await fetchMovies()
        setMovies(data)
      } catch (error) {
        console.error("Error loading movies:", error)
      } finally {
        setLoading(false)
      }
    }
    loadMovies()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing movies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider Section */}
      <HeroSlider movies={movies} />
      
      {/* Featured Movies Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Now Showing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the latest blockbusters and indie gems playing at INOX Cinema
            </p>
          </div>
          <MovieList movies={movies} />
        </div>
      </section>
    </div>
  )
}

export default HomePage