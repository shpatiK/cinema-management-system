import express from "express"
import {
  createBooking,
  getBookingByReference,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/BookingController"
// Try importing everything and then destructuring
import * as auth from "../utils/auth"

const router = express.Router()

// Public routes
router.post("/", createBooking)
router.get("/reference/:reference", getBookingByReference)

// Protected routes (require authentication)
router.get("/user", auth.authMiddleware, getUserBookings)
router.get("/my-bookings", auth.authMiddleware, getUserBookings)
router.put("/:id/cancel", auth.authMiddleware, cancelBooking)

// Admin routes
router.get("/admin/all", auth.authMiddleware, auth.adminMiddleware, getAllBookings)
router.put("/admin/:id/status", auth.authMiddleware, auth.adminMiddleware, updateBookingStatus)

export default router
