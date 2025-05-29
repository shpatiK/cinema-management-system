import { Router } from "express"
import MovieController from "../controllers/MovieController"
import { authMiddleware } from "../utils/auth" // Update to match your middleware name

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - release_year
 *         - poster_url
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           description: Auto-generated movie ID
 *         title:
 *           type: string
 *           example: "Inception"
 *           maxLength: 255
 *         director:
 *           type: string
 *           example: "Christopher Nolan"
 *         release_year:
 *           type: integer
 *           format: int32
 *           example: 2010
 *           minimum: 1888
 *           maximum: 2030
 *         duration:
 *           type: integer
 *           description: Duration in minutes
 *           example: 148
 *         poster_url:
 *           type: string
 *           example: "/posters/inception.jpg"
 *         description:
 *           type: string
 *           example: "A thief who steals corporate secrets through dream-sharing technology"
 *         actors:
 *           oneOf:
 *             - type: string
 *               example: "Leonardo DiCaprio, Marion Cotillard, Tom Hardy"
 *             - type: array
 *               items:
 *                 type: string
 *               example: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MovieWithShowtimes:
 *       allOf:
 *         - $ref: '#/components/schemas/Movie'
 *         - type: object
 *           properties:
 *             showtimes:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   cinema:
 *                     type: string
 *                     example: "INOX Mall"
 *                   time:
 *                     type: string
 *                     format: time
 *                     example: "19:30"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-01-25"
 *                   hall:
 *                     type: string
 *                     example: "Hall 1"
 *                   seats:
 *                     type: integer
 *                     example: 100
 *                   type:
 *                     type: string
 *                     enum: [2D, 3D, IMAX]
 *                     example: "IMAX"
 *                   price:
 *                     type: number
 *                     format: decimal
 *                     example: 15.00
 *     CreateMovieRequest:
 *       type: object
 *       required:
 *         - title
 *         - release_year
 *         - poster_url
 *       properties:
 *         title:
 *           type: string
 *           example: "Inception"
 *           maxLength: 255
 *         director:
 *           type: string
 *           example: "Christopher Nolan"
 *         release_year:
 *           type: integer
 *           example: 2010
 *           minimum: 1888
 *           maximum: 2030
 *         duration:
 *           type: integer
 *           example: 148
 *         poster_url:
 *           type: string
 *           example: "/posters/inception.jpg"
 *         description:
 *           type: string
 *           example: "A thief who steals corporate secrets through dream-sharing technology"
 *         actors:
 *           oneOf:
 *             - type: string
 *               example: "Leonardo DiCaprio, Marion Cotillard, Tom Hardy"
 *             - type: array
 *               items:
 *                 type: string
 *               example: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"]
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Validation Error"
 *         message:
 *           type: string
 *           example: "Title is required"
 *         details:
 *           type: string
 *           example: "Additional error details"
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Limit number of movies returned
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search movies by title, director, or description
 *         example: "inception"
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", MovieController.getAllMovies)

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get a movie by ID with showtimes
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Movie details with showtimes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieWithShowtimes'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", MovieController.getMovieById)

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovieRequest'
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authMiddleware, MovieController.createMovie)

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovieRequest'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", authMiddleware, MovieController.updateMovie)

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movie deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authMiddleware, MovieController.deleteMovie)

export default router
