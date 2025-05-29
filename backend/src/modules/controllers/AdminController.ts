import type { Request, Response } from "express"
import { sequelize } from "../../db/postgres"
import { QueryTypes } from "sequelize"
import { redisClient } from "../../cache/redisClient"

// User management functions
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT id, username, email, role, "isActive", "createdAt", "updatedAt"
      FROM users 
      ORDER BY "createdAt" DESC
    `

    const users = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    })

    res.json(users)
  } catch (error: any) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Failed to fetch users", details: error.message })
  }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role = "user" } = req.body

    // Simple password hashing (you should use bcrypt in production)
    const hashedPassword = password // For now, store as plain text - implement proper hashing later

    const query = `
      INSERT INTO users (username, email, password, role, "isActive", "createdAt", "updatedAt")
      VALUES (:username, :email, :password, :role, true, NOW(), NOW())
      RETURNING id, username, email, role, "isActive", "createdAt", "updatedAt"
    `

    const result = await sequelize.query(query, {
      replacements: { username, email, password: hashedPassword, role },
      type: QueryTypes.INSERT,
    })

    res.status(201).json(result[0])
  } catch (error: any) {
    console.error("Error creating user:", error)
    res.status(500).json({ error: "Failed to create user", details: error.message })
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { username, email, role, isActive } = req.body

    const query = `
      UPDATE users 
      SET 
        username = COALESCE(:username, username),
        email = COALESCE(:email, email),
        role = COALESCE(:role, role),
        "isActive" = COALESCE(:isActive, "isActive"),
        "updatedAt" = NOW()
      WHERE id = :userId
      RETURNING id, username, email, role, "isActive", "createdAt", "updatedAt"
    `

    const result = await sequelize.query(query, {
      replacements: { userId, username, email, role, isActive },
      type: QueryTypes.UPDATE,
    })

    if (!result[0] || (result[0] as any[]).length === 0) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.json(result[0])
  } catch (error: any) {
    console.error("Error updating user:", error)
    res.status(500).json({ error: "Failed to update user", details: error.message })
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params

    const deleteQuery = `DELETE FROM users WHERE id = :userId`
    await sequelize.query(deleteQuery, {
      replacements: { userId },
      type: QueryTypes.DELETE,
    })

    res.json({ message: "User deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    res.status(500).json({ error: "Failed to delete user", details: error.message })
  }
}

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { isActive } = req.body

    const query = `
      UPDATE users 
      SET "isActive" = :isActive, "updatedAt" = NOW()
      WHERE id = :userId
      RETURNING id, username, email, role, "isActive", "createdAt", "updatedAt"
    `

    const result = await sequelize.query(query, {
      replacements: { userId, isActive },
      type: QueryTypes.UPDATE,
    })

    if (!result[0] || (result[0] as any[]).length === 0) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.json(result[0])
  } catch (error: any) {
    console.error("Error toggling user status:", error)
    res.status(500).json({ error: "Failed to toggle user status", details: error.message })
  }
}

// Movie management functions - Using the same logic as MovieController
export const getAllMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = "all_movies"

    // Check cache first
    const cached = await redisClient.get(cacheKey)
    if (cached) {
      console.log("🔁 Movies served from cache (admin)")
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
        actors,
        "createdAt",
        "updatedAt"
      FROM movies 
      ORDER BY "createdAt" DESC
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
  } catch (error: any) {
    console.error("Error fetching movies (admin):", error)
    res.status(500).json({ error: "Failed to fetch movies", details: error.message })
  }
}

export const createMovie = async (req: Request, res: Response): Promise<void> => {
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

    // Clear cache to ensure fresh data
    await redisClient.del("all_movies")
    console.log("🗑️ Cleared movie cache after creation")

    console.log("✅ Movie created successfully (admin)")
    res.status(201).json(results[0])
  } catch (error: any) {
    console.error("Error creating movie (admin):", error)
    res.status(500).json({ error: "Failed to create movie", details: error.message })
  }
}

export const updateMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId } = req.params
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
    console.log("🗑️ Cleared movie cache after update")

    console.log("✅ Movie updated successfully (admin)")
    res.json(results[0])
  } catch (error: any) {
    console.error("Error updating movie (admin):", error)
    res.status(500).json({ error: "Failed to update movie", details: error.message })
  }
}

export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId } = req.params

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
    console.log("🗑️ Cleared movie cache after deletion")

    console.log("✅ Movie deleted successfully (admin)")
    res.json({ message: "Movie deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting movie (admin):", error)
    res.status(500).json({ error: "Failed to delete movie", details: error.message })
  }
}
