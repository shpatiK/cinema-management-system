"use client"

import { useState, useEffect, useMemo } from "react"
import { FaSearch, FaSortAmountDown, FaSortAmountUp, FaClock } from "react-icons/fa"
import MovieCard from "../components/MovieCard"
import { fetchMovies } from "../services/api"

interface MovieType {
  id: number
  title: string
  duration: number
  release_year: number
  poster_url: string
  rating?: number
  genre?: string
  description?: string
}

// Sample genres - replace with your actual genres
const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Animation",
  "Documentary",
]

const MoviesPage = () => {
  const [movies, setMovies] = useState<MovieType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtering and sorting states
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "release_year">("release_year")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 12

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        const data = await fetchMovies()
        setMovies(data)
      } catch (err) {
        setError("Failed to load movies. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadMovies()
  }, [])

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let result = [...movies]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((movie) => movie.title.toLowerCase().includes(query))
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else {
        // Default: sort by release year
        return sortOrder === "asc" ? a.release_year - b.release_year : b.release_year - a.release_year
      }
    })

    return result
  }, [movies, searchQuery, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage)
  const currentMovies = filteredMovies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSortBy("release_year")
    setSortOrder("desc")
    setCurrentPage(1)
  }

  // Skeleton loader for movies
  const MovieSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-64 h-96 animate-pulse">
      <div className="bg-gray-300 h-80"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Discover <span className="text-yellow-400">Movies</span>
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-200 mb-8">
            Explore our collection of the latest blockbusters, timeless classics, and independent gems
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search for movies..."
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white shadow-md py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "title" | "release_year")}
                className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="release_year">Release Year</option>
                <option value="title">Title</option>
              </select>
            </div>

            <button
              onClick={toggleSortOrder}
              className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 transition-colors"
            >
              {sortOrder === "asc" ? <FaSortAmountUp className="mr-1" /> : <FaSortAmountDown className="mr-1" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>

            <button onClick={resetFilters} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-medium">{filteredMovies.length}</span> movies
            {searchQuery && (
              <>
                {" "}
                matching <span className="font-medium">"{searchQuery}"</span>
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {[...Array(8)].map((_, index) => (
              <MovieSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl font-bold mb-2">No movies found</div>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button onClick={resetFilters} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {currentMovies.map((movie) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1
                    // Show current page, first, last, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === pageNumber
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    }
                    // Show ellipsis for skipped pages
                    if (
                      (pageNumber === currentPage - 2 && pageNumber > 2) ||
                      (pageNumber === currentPage + 2 && pageNumber < totalPages - 1)
                    ) {
                      return (
                        <span key={pageNumber} className="px-4 py-2">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      
            
          
        
      </div>
    
  )
}

export default MoviesPage
