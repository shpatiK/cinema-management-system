import { Router } from "express"
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/AdminController"
import { authenticateToken } from "../middlewares/authenticateToken"
import { checkAdminRole } from "../middlewares/checkAdminRole"

const router = Router()

// Apply authentication and admin check to all routes
router.use(authenticateToken)
router.use(checkAdminRole)

// User management routes
router.get("/users", getAllUsers)
router.post("/users", createUser)
router.put("/users/:userId", updateUser)
router.delete("/users/:userId", deleteUser)
router.put("/users/:userId/toggle-status", toggleUserStatus)

// Movie management routes
router.get("/movies", getAllMovies)
router.post("/movies", createMovie)
router.put("/movies/:movieId", updateMovie)
router.delete("/movies/:movieId", deleteMovie)

export default router
