import express from "express"
// Try importing everything and then destructuring
import * as auth from "../utils/auth"
import AuthController from "../controllers/AuthController"

const router = express.Router()

// Public routes
router.post("/register", AuthController.register)
router.post("/login", AuthController.login)
router.get("/activate", AuthController.activate)

// Protected routes - using the imported auth object
router.get("/me", auth.authMiddleware, AuthController.getCurrentUser)
router.put("/update-profile", auth.authMiddleware, AuthController.updateProfile)

export default router
