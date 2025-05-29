import type { Request, Response } from "express"
import { redisClient } from "../../cache/redisClient"
import { sequelize } from "../../db/postgres"
import { QueryTypes } from "sequelize"

class MovieController {
  // GET movie by ID with showtimes
  static async getMovieById(req: Request, res: Response): Promise<void> {
    const movieId = req.params.id
    const cacheKey = `movie_${movieId}`

    console.log("🔍 Fetching movie with ID:", movieId)

    try {
      // Check cache first
      const cached = await redisClient.get(cacheKey)
      if (cached) {
        console.log("🔁 Movie details served from cache")
        const cachedString = typeof cached === "string" ? cached : cached.toString("utf-8")
        res.json(JSON.parse(cachedString))
        return
      }

      console.log("📊 Executing database query...")

      const query = `
        SELECT 
          m.id,
          m.title,
          m.duration,
          m.release_year,
          m.poster_url,
          m.description,
          m.director,
          m.actors,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', s.id,
                'cinema', s.cinema,
                'time', s.time,
                'date', s.date,
                'hall', s.hall,
                'seats', s.seats,
                'type', s.type,
                'price', s.price
              )
            ) FILTER (WHERE s.id IS NOT NULL), 
            '[]'::json
          ) as showtimes
        FROM movies m 
        LEFT JOIN showtimes s ON m.id = s.movie_id 
        WHERE m.id = :movieId
        GROUP BY m.id, m.title, m.duration, m.release_year, m.poster_url, m.description, m.director, m.actors
      `

      console.log("🔍 Query:", query)
      console.log("🔍 Parameters:", { movieId })

      const results = await sequelize.query(query, {
        replacements: { movieId },
        type: QueryTypes.SELECT,
      })

      console.log("📊 Query results:", results)

      if (!results || results.length === 0) {
        console.log("❌ No movie found with ID:", movieId)
        res.status(404).json({ error: "Movie not found" })
        return
      }

      const movie = results[0] as any
      console.log("🎬 Movie data before processing:", movie)

      // Enhanced actors formatting - handle multiple formats
      if (movie.actors) {
        let actorsArray: string[] = []

        if (typeof movie.actors === "string") {
          // Handle different string formats
          let actorsString = movie.actors

          // Remove curly braces, square brackets, and quotes
          actorsString = actorsString
            .replace(/[{}[\]"]/g, "") // Remove {, }, [, ], "
            .replace(/'/g, "") // Remove single quotes
            .trim()

          // Split by comma and clean up each actor name
          if (actorsString) {
            actorsArray = actorsString
              .split(",")
              .map((actor: string) => actor.trim())
              .filter((actor: string) => actor.length > 0)
          }
        } else if (Array.isArray(movie.actors)) {
          actorsArray = movie.actors
        }

        movie.actors = actorsArray
      } else {
        movie.actors = []
      }

      console.log("🎬 Movie data after processing:", movie)

      // Cache the result for 30 minutes
      await redisClient.setEx(cacheKey, 1800, JSON.stringify(movie))
      console.log("✅ Cached movie details")

      res.json(movie)
    } catch (err: any) {
      console.error("❌ Database error:", err)
      console.error("❌ Error details:", err.message)
      res.status(500).json({ error: "Internal server error", details: err.message })
    }
  }

  // GET all movies
  static async getAllMovies(req: Request, res: Response): Promise<void> {
    try {
      const cacheKey = "all_movies"

      // Check cache first
      const cached = await redisClient.get(cacheKey)
      if (cached) {
        console.log("🔁 Movies served from cache")
        const cachedString = typeof cached === "string" ? cached : cached.toString("utf-8")
        res.json(JSON.parse(cachedString))
        return
      }

      const query = `
        SELECT 
          id,
          title,
          duration,
          release_year,
          poster_url,
          description,
          director,
          actors
        FROM movies 
        ORDER BY release_year DESC
      `

      const results = await sequelize.query(query, {
        type: QueryTypes.SELECT,
      })

      // Fix actors formatting for all movies
      const moviesWithFormattedActors = (results as any[]).map((movie) => {
        if (movie.actors && typeof movie.actors === "string") {
          const actorsString = movie.actors
            .replace(/[{}[\]"']/g, "") // Remove all brackets and quotes
            .trim()

          if (actorsString) {
            movie.actors = actorsString
              .split(",")
              .map((actor: string) => actor.trim())
              .filter((actor: string) => actor.length > 0)
          } else {
            movie.actors = []
          }
        }
        return movie
      })

      // Cache for 10 minutes
      await redisClient.setEx(cacheKey, 600, JSON.stringify(moviesWithFormattedActors))

      res.json(moviesWithFormattedActors)
    } catch (err: any) {
      console.error("❌ Error fetching movies:", err)
      res.status(500).json({ error: "Internal server error", details: err.message })
    }
  }

  // CREATE new movie
  static async createMovie(req: Request, res: Response): Promise<void> {
    try {
      const { title, duration, release_year, poster_url, description, director, actors } = req.body

      // Validate required fields
      if (!title || !release_year || !poster_url) {
        res.status(400).json({
          error: "Missing required fields",
          required: ["title", "release_year", "poster_url"],
        })
        return
      }

      // Format actors as comma-separated string if it's an array
      let actorsString = actors
      if (Array.isArray(actors)) {
        actorsString = actors.join(", ")
      }

      const query = `
        INSERT INTO movies (title, duration, release_year, poster_url, description, director, actors, "createdAt", "updatedAt")
        VALUES (:title, :duration, :release_year, :poster_url, :description, :director, :actors, NOW(), NOW())
        RETURNING *
      `

      const results = await sequelize.query(query, {
        replacements: {
          title,
          duration: duration || null,
          release_year,
          poster_url,
          description: description || null,
          director: director || null,
          actors: actorsString || null,
        },
        type: QueryTypes.INSERT,
      })

      // Clear cache
      await redisClient.del("all_movies")

      console.log("✅ Movie created successfully")
      res.status(201).json(results[0])
    } catch (err: any) {
      console.error("❌ Error creating movie:", err)
      res.status(500).json({ error: "Internal server error", details: err.message })
    }
  }

  // UPDATE movie
  static async updateMovie(req: Request, res: Response): Promise<void> {
    try {
      const movieId = req.params.id
      const { title, duration, release_year, poster_url, description, director, actors } = req.body

      // Format actors as comma-separated string if it's an array
      let actorsString = actors
      if (Array.isArray(actors)) {
        actorsString = actors.join(", ")
      }

      const query = `
        UPDATE movies 
        SET 
          title = COALESCE(:title, title),
          duration = COALESCE(:duration, duration),
          release_year = COALESCE(:release_year, release_year),
          poster_url = COALESCE(:poster_url, poster_url),
          description = COALESCE(:description, description),
          director = COALESCE(:director, director),
          actors = COALESCE(:actors, actors),
          "updatedAt" = NOW()
        WHERE id = :movieId
        RETURNING *
      `

      const results = await sequelize.query(query, {
        replacements: {
          movieId,
          title: title || null,
          duration: duration || null,
          release_year: release_year || null,
          poster_url: poster_url || null,
          description: description || null,
          director: director || null,
          actors: actorsString || null,
        },
        type: QueryTypes.UPDATE,
      })

      if (!results[0] || (results[0] as any[]).length === 0) {
        res.status(404).json({ error: "Movie not found" })
        return
      }

      // Clear cache
      await redisClient.del("all_movies")
      await redisClient.del(`movie_${movieId}`)

      console.log("✅ Movie updated successfully")
      res.json(results[0])
    } catch (err: any) {
      console.error("❌ Error updating movie:", err)
      res.status(500).json({ error: "Internal server error", details: err.message })
    }
  }

  // DELETE movie
  static async deleteMovie(req: Request, res: Response): Promise<void> {
    try {
      const movieId = req.params.id

      // First check if movie exists
      const checkQuery = `SELECT id FROM movies WHERE id = :movieId`
      const existingMovie = await sequelize.query(checkQuery, {
        replacements: { movieId },
        type: QueryTypes.SELECT,
      })

      if (!existingMovie || existingMovie.length === 0) {
        res.status(404).json({ error: "Movie not found" })
        return
      }

      // Delete related showtimes first (if any)
      const deleteShowtimesQuery = `DELETE FROM showtimes WHERE movie_id = :movieId`
      await sequelize.query(deleteShowtimesQuery, {
        replacements: { movieId },
        type: QueryTypes.DELETE,
      })

      // Delete the movie
      const deleteMovieQuery = `DELETE FROM movies WHERE id = :movieId`
      await sequelize.query(deleteMovieQuery, {
        replacements: { movieId },
        type: QueryTypes.DELETE,
      })

      // Clear cache
      await redisClient.del("all_movies")
      await redisClient.del(`movie_${movieId}`)

      console.log("✅ Movie deleted successfully")
      res.json({ message: "Movie deleted successfully" })
    } catch (err: any) {
      console.error("❌ Error deleting movie:", err)
      res.status(500).json({ error: "Internal server error", details: err.message })
    }
  }
}

export default MovieController
