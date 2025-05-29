import type React from "react"

interface UpcomingMovie {
  id: string
  title: string
  poster_url: string
  release_date?: string
}

interface UpcomingMoviesListProps {
  movies: UpcomingMovie[]
}

const UpcomingMoviesList: React.FC<UpcomingMoviesListProps> = ({ movies }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {movies.map((movie) => (
        <div key={movie.id} className="w-64 transition-all duration-300 transform hover:scale-105">
          {/* Just the Poster Image - No overlays or text */}
          <div className="rounded-lg overflow-hidden shadow-lg h-96 bg-gray-800">
            <img
              src={movie.poster_url || "/placeholder.svg"}
              alt={`Movie poster`}
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=300"
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default UpcomingMoviesList
