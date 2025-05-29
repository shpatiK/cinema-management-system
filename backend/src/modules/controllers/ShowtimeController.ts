import type { Request, Response } from "express"
import { sequelize } from "../../db/postgres"
import { QueryTypes } from "sequelize"

// Get showtimes for a specific movie
export const getShowtimesByMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId } = req.params

    const query = `
      SELECT 
        s.*,
        m.title as movie_title,
        m.poster_url,
        m.duration
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.id
      WHERE s.movie_id = :movieId
      AND s.date >= CURRENT_DATE
      ORDER BY s.date ASC, s.time ASC
    `

    const showtimes = await sequelize.query(query, {
      replacements: { movieId },
      type: QueryTypes.SELECT,
    })

    res.json(showtimes)
  } catch (error: any) {
    console.error("Error fetching showtimes for movie:", error)
    res.status(500).json({ error: "Failed to fetch showtimes", details: error.message })
  }
}

// Get all showtimes
export const getAllShowtimes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, cinema } = req.query

    let whereClause = "WHERE s.date >= CURRENT_DATE"
    const replacements: any = {}

    if (date) {
      whereClause += " AND s.date = :date"
      replacements.date = date
    }

    if (cinema) {
      whereClause += " AND s.cinema = :cinema"
      replacements.cinema = cinema
    }

    const query = `
      SELECT 
        s.*,
        m.title as movie_title,
        m.poster_url,
        m.duration,
        m.director
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.id
      ${whereClause}
      ORDER BY s.date ASC, s.time ASC
    `

    const showtimes = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    })

    res.json(showtimes)
  } catch (error: any) {
    console.error("Error fetching showtimes:", error)
    res.status(500).json({ error: "Failed to fetch showtimes", details: error.message })
  }
}

// Create a new showtime (admin only)
export const createShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movie_id, cinema, hall, date, time, seats, type, price } = req.body

    // Validate required fields
    if (!movie_id || !cinema || !hall || !date || !time || !seats || !type || !price) {
      res.status(400).json({
        error: "Missing required fields",
        required: ["movie_id", "cinema", "hall", "date", "time", "seats", "type", "price"],
      })
      return
    }

    // Check if movie exists
    const movieCheck = await sequelize.query("SELECT id FROM movies WHERE id = :movieId", {
      replacements: { movieId: movie_id },
      type: QueryTypes.SELECT,
    })

    if (!movieCheck || movieCheck.length === 0) {
      res.status(404).json({ error: "Movie not found" })
      return
    }

    // Check for conflicting showtimes (same cinema, hall, date, time)
    const conflictCheck = await sequelize.query(
      `SELECT id FROM showtimes 
       WHERE cinema = :cinema AND hall = :hall AND date = :date AND time = :time`,
      {
        replacements: { cinema, hall, date, time },
        type: QueryTypes.SELECT,
      },
    )

    if (conflictCheck && conflictCheck.length > 0) {
      res.status(409).json({ error: "Showtime conflict: Another movie is scheduled at this time and location" })
      return
    }

    const insertQuery = `
      INSERT INTO showtimes (movie_id, cinema, hall, date, time, seats, type, price, created_at, updated_at)
      VALUES (:movie_id, :cinema, :hall, :date, :time, :seats, :type, :price, NOW(), NOW())
      RETURNING *
    `

    const result = await sequelize.query(insertQuery, {
      replacements: { movie_id, cinema, hall, date, time, seats, type, price },
      type: QueryTypes.INSERT,
    })

    console.log("✅ Showtime created successfully")
    res.status(201).json(result[0])
  } catch (error: any) {
    console.error("Error creating showtime:", error)
    res.status(500).json({ error: "Failed to create showtime", details: error.message })
  }
}
