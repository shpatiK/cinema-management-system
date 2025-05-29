import express from "express"
import dotenv from "dotenv"
import { connectPostgres } from "./db/postgres"
import { connectMongoDB } from "./db/mongo" // ADD THIS - MongoDB connection
import { connectRedis } from "./cache/redisClient"
import cors from "cors"
import { config } from "./config"
import authRoutes from "./modules/routes/authRoutes"
import adminRoutes from "./modules/routes/adminRoutes"
import bookingRoutes from "./modules/routes/bookingRoutes"
import movieRoutes from "./modules/routes/movieRoutes"
import showtimeRoutes from "./modules/routes/showtimeRoutes"
import logRoutes from "./modules/routes/logRoutes" // ADD THIS - Log routes
import path from "path"
import expressStatusMonitor from "express-status-monitor"
import { setupSwagger } from "./modules/swagger/swaggerConfig"
import { sequelize } from "./db/postgres"
import User from "./modules/models/User"
import Movie from "./modules/models/Movie"
import { requestLoggingMiddleware, errorLoggingMiddleware } from "./modules/middlewares/loggingMiddleware" // ADD THIS
import { Logger } from "./modules/utils/logger" // ADD THIS

dotenv.config()

const app = express()

// Basic middleware
app.use(express.json())
app.use(expressStatusMonitor())
app.use(
  cors({
    origin: config.frontendUrl,
  }),
)
app.use("/posters", express.static(path.join(__dirname, "../public/posters")))

// ADD THIS - Logging middleware BEFORE routes
app.use(requestLoggingMiddleware)

setupSwagger(app)

// Add routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/movies", movieRoutes)
app.use("/api/showtimes", showtimeRoutes)
app.use("/api/admin/logs", logRoutes) // ADD THIS - Log routes

// Basic route
app.get("/", (req, res) => {
  res.send("🎬 Cinema Management System Backend is Running!")
})

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

// MODIFY THIS - Enhanced database initialization with MongoDB and logging
async function initializeDatabase() {
  try {
    await connectPostgres()
    await connectMongoDB() // ADD THIS - MongoDB connection
    await connectRedis()
    await sequelize.sync({ alter: true })
    console.log("✅ Databases connected and tables synced!")

    // ADD THIS - Log system startup
    await Logger.logSystem("SYSTEM_STARTUP", {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    })

    // Create admin user if doesn't exist
    const [adminUser, created] = await User.findOrCreate({
      where: { username: "admin" },
      defaults: {
        username: "admin",
        password: "admin123",
        email: "admin@cinema.com",
        role: "admin",
        isActive: true, // ADD THIS
      },
    })

    // ADD THIS - Log admin user creation
    if (created) {
      await Logger.logSystem("ADMIN_USER_CREATED", {
        userId: adminUser.id,
        username: adminUser.username,
      })
    }

    // Create sample movies
    const sampleMovies = [
      {
        title: "Inception",
        duration: 148,
        poster_url: "/posters/inception.jpg",
        release_year: 2010,
        description:
          "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        director: "Christopher Nolan",
        actors: "Leonardo DiCaprio, Marion Cotillard, Tom Hardy",
      },
      {
        title: "The Dark Knight",
        duration: 152,
        poster_url: "/posters/dark-knight.jpg",
        release_year: 2008,
        description:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
        director: "Christopher Nolan",
        actors: "Christian Bale, Heath Ledger, Aaron Eckhart",
      },
      {
        title: "Interstellar",
        duration: 169,
        poster_url: "/posters/interstellar.jpg",
        release_year: 2014,
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        director: "Christopher Nolan",
        actors: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
      },
    ]

    // ADD THIS - Log movie creation
    for (const movieData of sampleMovies) {
      const [movie, movieCreated] = await Movie.findOrCreate({
        where: { title: movieData.title },
        defaults: movieData,
      })

      if (movieCreated) {
        await Logger.logSystem("SAMPLE_MOVIE_CREATED", {
          movieId: movie.id,
          title: movie.title,
        })
      }
    }

    await createSampleShowtimes()
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    // ADD THIS - Log startup failure
    await Logger.logSystem(
      "SYSTEM_STARTUP_FAILED",
      {
        error: error.message,
        stack: error.stack,
      },
      "ERROR",
    )
    process.exit(1)
  }
}

async function createSampleShowtimes() {
  try {
    const { QueryTypes } = await import("sequelize")
    const movies = await sequelize.query("SELECT id FROM movies LIMIT 3", {
      type: QueryTypes.SELECT,
    })

    if (movies.length > 0) {
      for (const movie of movies as any[]) {
        const existingShowtimes = await sequelize.query(
          "SELECT COUNT(*) as count FROM showtimes WHERE movie_id = :movieId",
          {
            replacements: { movieId: movie.id },
            type: QueryTypes.SELECT,
          },
        )

        if ((existingShowtimes[0] as any).count === 0) {
          for (let i = 0; i < 7; i++) {
            const date = new Date()
            date.setDate(date.getDate() + i)
            const dateString = date.toISOString().split("T")[0]

            const times = ["10:00", "13:30", "16:00", "19:30", "22:00"]
            const cinemas = ["INOX Mall", "PVR Central", "Cineplex Downtown"]
            const halls = ["Hall 1", "Hall 2", "Hall 3"]
            const types = ["2D", "IMAX", "3D"]

            for (let j = 0; j < 3; j++) {
              await sequelize.query(
                `INSERT INTO showtimes (movie_id, cinema, hall, date, time, seats, type, price, created_at, updated_at)
                VALUES (:movieId, :cinema, :hall, :date, :time, :seats, :type, :price, NOW(), NOW())`,
                {
                  replacements: {
                    movieId: movie.id,
                    cinema: cinemas[j % cinemas.length],
                    hall: halls[j % halls.length],
                    date: dateString,
                    time: times[j % times.length],
                    seats: 100,
                    type: types[j % types.length],
                    price: 12.5 + j * 2.5,
                  },
                },
              )
            }
          }
        }
      }
      console.log("✅ Sample showtimes created")
    }
  } catch (error) {
    console.error("❌ Error creating sample showtimes:", error)
  }
}

// ADD THIS - Error logging middleware AFTER routes
app.use(errorLoggingMiddleware)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Server Error:", err.stack)
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong!",
  })
})

// 404 handler - FIXED VERSION (no wildcard)
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  })
})

// Server startup
async function startServer() {
  try {
    console.log("⚡ Starting Cinema Management System...")
    await initializeDatabase()

    app.listen(config.port, () => {
      console.log(`🚀 Server running on ${config.apiUrl}`)
      console.log(`📚 API docs available at ${config.apiUrl}/api-docs`)
      console.log(`🌐 Allowing requests from ${config.frontendUrl}`)
      console.log(`📊 Status monitor at ${config.apiUrl}/status`)
      console.log("✅ Cinema Management System is ready!")

      // ADD THIS - Log successful startup
      Logger.logSystem("SERVER_STARTED", {
        port: config.port,
        apiUrl: config.apiUrl,
        frontendUrl: config.frontendUrl,
      })
    })
  } catch (error) {
    console.error("❌ Fatal startup error:", error)
    // ADD THIS - Log startup failure
    await Logger.logSystem(
      "SERVER_STARTUP_FAILED",
      {
        error: error.message,
        stack: error.stack,
      },
      "ERROR",
    )
    process.exit(1)
  }
}

// MODIFY THIS - Enhanced graceful shutdown with logging
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...")
  try {
    await Logger.logSystem("SERVER_SHUTDOWN", { reason: "SIGTERM" }) // ADD THIS
    await sequelize.close()
    console.log("✅ Database connections closed")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error during shutdown:", error)
    process.exit(1)
  }
})

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully...")
  try {
    await Logger.logSystem("SERVER_SHUTDOWN", { reason: "SIGINT" }) // ADD THIS
    await sequelize.close()
    console.log("✅ Database connections closed")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error during shutdown:", error)
    process.exit(1)
  }
})

startServer()

export default app
