"use client"

import { useState, useEffect } from "react"
import MovieList from "../components/MovieList"
import HeroSlider from "../components/HeroSlider"
import UpcomingMoviesList from "../components/UpcomingMoviesList"
import { fetchMovies } from "../services/api"

// Import images from assets
import karatekidPoster from "../assets/images/karatekid.jpg"
import missionPoster from "../assets/images/mission.jpg"
import fantasticPoster from "../assets/images/fantastic.jpg"
import supermanPoster from "../assets/images/superman.jpg"

interface MovieProps {
  id: number
  title: string
  duration: number
  release_year?: number
  poster_url?: string
  genre?: string
  rating?: number
  description?: string
  featured?: boolean
}

// Static data for upcoming movies using imported images
const upcomingMovies = [
  {
    id: "upcoming-1",
    title: "Karate Kid Legends",
    poster_url: karatekidPoster,
    release_date: "Coming March 2025",
  },
  {
    id: "upcoming-2",
    title: "Mission: Impossible - The Final Reckoning",
    poster_url: missionPoster,
    release_date: "Coming November 2024",
  },
  {
    id: "upcoming-3",
    title: "The Fantastic Four: First Steps",
    poster_url: fantasticPoster,
    release_date: "Coming June 2024",
  },
  {
    id: "upcoming-4",
    title: "Superman",
    poster_url: supermanPoster,
    release_date: "Coming July 2024",
  },
]

const HomePage = () => {
  const [movies, setMovies] = useState<MovieProps[]>([])
  const [loading, setLoading] = useState(true)

  // Define the IDs of movies you want to feature in the slider (IDs 4 to 9)
  const featuredMovieIds = [4, 5, 6, 7, 8, 9]

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
      {/* Hero Slider Section - Now shows movies with IDs 4-9 */}
      <HeroSlider movies={movies} featuredMovieIds={featuredMovieIds} />

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

      {/* Coming Soon Section - White background for contrast */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get ready for these upcoming releases</p>
          </div>
          {/* Show upcoming movies - just posters */}
          <UpcomingMoviesList movies={upcomingMovies} />
        </div>
      </section>
    </div>
  )
}

export default HomePage
