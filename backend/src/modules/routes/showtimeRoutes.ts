import { Router } from "express"
import { getShowtimesByMovie, getAllShowtimes, createShowtime } from "../controllers/ShowtimeController"
import { authMiddleware } from "../utils/auth" // Update to match your middleware name

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Showtimes
 *   description: Movie showtime management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Showtime:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         movie_id:
 *           type: integer
 *           example: 1
 *         cinema:
 *           type: string
 *           example: "INOX Mall"
 *         hall:
 *           type: string
 *           example: "Hall 1"
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-01-25"
 *         time:
 *           type: string
 *           format: time
 *           example: "19:30"
 *         seats:
 *           type: integer
 *           minimum: 1
 *           example: 100
 *         type:
 *           type: string
 *           enum: [2D, 3D, IMAX]
 *           example: "IMAX"
 *         price:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *           example: 15.00
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     ShowtimeWithMovie:
 *       allOf:
 *         - $ref: '#/components/schemas/Showtime'
 *         - type: object
 *           properties:
 *             movie_title:
 *               type: string
 *               example: "Inception"
 *             poster_url:
 *               type: string
 *               example: "/posters/inception.jpg"
 *             duration:
 *               type: integer
 *               example: 148
 *             director:
 *               type: string
 *               example: "Christopher Nolan"
 *     CreateShowtimeRequest:
 *       type: object
 *       required:
 *         - movie_id
 *         - cinema
 *         - hall
 *         - date
 *         - time
 *         - seats
 *         - type
 *         - price
 *       properties:
 *         movie_id:
 *           type: integer
 *           example: 1
 *         cinema:
 *           type: string
 *           example: "INOX Mall"
 *         hall:
 *           type: string
 *           example: "Hall 1"
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-01-25"
 *         time:
 *           type: string
 *           format: time
 *           example: "19:30"
 *         seats:
 *           type: integer
 *           minimum: 1
 *           example: 100
 *         type:
 *           type: string
 *           enum: [2D, 3D, IMAX]
 *           example: "IMAX"
 *         price:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *           example: 15.00
 */

/**
 * @swagger
 * /showtimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [Showtimes]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date
 *         example: "2025-01-25"
 *       - in: query
 *         name: cinema
 *         schema:
 *           type: string
 *         description: Filter by cinema name
 *         example: "INOX Mall"
 *     responses:
 *       200:
 *         description: List of showtimes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShowtimeWithMovie'
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllShowtimes)

/**
 * @swagger
 * /showtimes/movie/{movieId}:
 *   get:
 *     summary: Get showtimes for a specific movie
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *         example: 1
 *     responses:
 *       200:
 *         description: List of showtimes for the movie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShowtimeWithMovie'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.get("/movie/:movieId", getShowtimesByMovie)

/**
 * @swagger
 * /showtimes:
 *   post:
 *     summary: Create a new showtime
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShowtimeRequest'
 *     responses:
 *       201:
 *         description: Showtime created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Showtime'
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *                 required:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["movie_id", "cinema", "hall", "date", "time", "seats", "type", "price"]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Movie not found
 *       409:
 *         description: Showtime conflict - Another movie is scheduled at this time and location
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, createShowtime)

export default router
