import type { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { sequelize } from "../../db/postgres" // Fixed path to match your structure
import { QueryTypes } from "sequelize"

// Extend Request type to include user property (matching your auth structure)
interface AuthRequest extends Request {
  user?: {
    id: number
    role: string
    iat?: number
    exp?: number
  }
}

// Get booking by reference
export const getBookingByReference = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reference } = req.params

    if (!reference) {
      res.status(400).json({ error: "Booking reference is required" })
      return
    }

    const query = `
      SELECT 
        b.*,
        m.title as movie_title,
        s.cinema,
        s.hall,
        s.time as showtime_time,
        s.date as showtime_date,
        s.type as screen_type
      FROM 
        bookings b
      JOIN 
        showtimes s ON b.showtime_id = s.id
      JOIN 
        movies m ON s.movie_id = m.id
      WHERE 
        b.booking_reference = :reference
    `

    const [booking] = await sequelize.query(query, {
      replacements: { reference },
      type: QueryTypes.SELECT,
    })

    if (!booking) {
      res.status(404).json({ error: "Booking not found" })
      return
    }

    res.status(200).json(booking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Create a new booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      showtime_id,
      movie_id,
      number_of_tickets,
      customer_name,
      customer_email,
      customer_phone,
      seat_numbers,
      payment_method,
      payment_status,
      paypal_order_id,
      total_price,
    } = req.body

    // Validate required fields
    if (!showtime_id || !number_of_tickets || !customer_name || !customer_email || !payment_method) {
      res.status(400).json({ error: "Missing required fields" })
      return
    }

    // Generate a unique booking reference
    const booking_reference = `BK-${uuidv4().substring(0, 8).toUpperCase()}`

    // Get user ID if authenticated (using your auth structure)
    let userId = null
    const authReq = req as AuthRequest
    if (authReq.user && authReq.user.id) {
      userId = authReq.user.id
    }

    // Insert booking into database
    const insertQuery = `
      INSERT INTO bookings (
        user_id, showtime_id, booking_reference, number_of_tickets, total_price,
        booking_status, customer_name, customer_email, customer_phone, 
        seat_numbers, payment_method, payment_status, booking_date, paypal_order_id
      )
      VALUES (
        :user_id, :showtime_id, :booking_reference, :number_of_tickets, :total_price,
        'confirmed', :customer_name, :customer_email, :customer_phone, 
        :seat_numbers, :payment_method, :payment_status, NOW(), :paypal_order_id
      )
      RETURNING *
    `

    const [result] = await sequelize.query(insertQuery, {
      replacements: {
        user_id: userId,
        showtime_id,
        booking_reference,
        number_of_tickets,
        total_price,
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        seat_numbers: seat_numbers ? JSON.stringify(seat_numbers) : null,
        payment_method,
        payment_status: payment_status || "pending",
        paypal_order_id: paypal_order_id || null,
      },
      type: QueryTypes.INSERT,
    })

    // Update seat availability in the showtime (if you have this table)
    try {
      if (seat_numbers && seat_numbers.length > 0) {
        await sequelize.query(
          `UPDATE showtimes SET available_seats = available_seats - :tickets WHERE id = :showtime_id`,
          {
            replacements: { tickets: number_of_tickets, showtime_id },
            type: QueryTypes.UPDATE,
          },
        )
      }
    } catch (updateError) {
      console.log("Note: Could not update seat availability (table may not exist):", updateError)
      // Continue without failing - seat availability update is optional
    }

    // Return the created booking
    res.status(201).json({
      message: "Booking created successfully",
      booking_reference,
      booking: result[0],
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get user bookings
export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const query = `
      SELECT 
        b.*,
        m.title as movie_title,
        m.poster_url,
        s.cinema,
        s.hall,
        s.time as showtime_time,
        s.date as showtime_date,
        s.type as screen_type
      FROM 
        bookings b
      JOIN 
        showtimes s ON b.showtime_id = s.id
      JOIN 
        movies m ON s.movie_id = m.id
      WHERE 
        b.user_id = :userId
      ORDER BY 
        b.booking_date DESC
    `

    const bookings = await sequelize.query(query, {
      replacements: { userId },
      type: QueryTypes.SELECT,
    })

    res.status(200).json(bookings)
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Cancel booking
export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    // Check if booking exists and belongs to user
    const [booking] = await sequelize.query(`SELECT * FROM bookings WHERE id = :id AND user_id = :userId`, {
      replacements: { id, userId },
      type: QueryTypes.SELECT,
    })

    if (!booking) {
      res.status(404).json({ error: "Booking not found or not authorized" })
      return
    }

    // Update booking status
    await sequelize.query(`UPDATE bookings SET booking_status = 'cancelled' WHERE id = :id`, {
      replacements: { id },
      type: QueryTypes.UPDATE,
    })

    // Return success message
    res.status(200).json({ message: "Booking cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get all bookings (admin only)
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    const userRole = req.user?.role

    if (!userId || userRole !== "admin") {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const query = `
      SELECT 
        b.*,
        m.title as movie_title,
        m.poster_url,
        s.cinema,
        s.hall,
        s.time as showtime_time,
        s.date as showtime_date,
        s.type as screen_type
      FROM 
        bookings b
      JOIN 
        showtimes s ON b.showtime_id = s.id
      JOIN 
        movies m ON s.movie_id = m.id
      ORDER BY 
        b.booking_date DESC
    `

    const bookings = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    })

    res.status(200).json(bookings)
  } catch (error) {
    console.error("Error fetching all bookings:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Update booking status (admin only)
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user?.id
    const userRole = req.user?.role

    if (!userId || userRole !== "admin") {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    if (!status) {
      res.status(400).json({ error: "Status is required" })
      return
    }

    // Check if booking exists
    const [booking] = await sequelize.query(`SELECT * FROM bookings WHERE id = :id`, {
      replacements: { id },
      type: QueryTypes.SELECT,
    })

    if (!booking) {
      res.status(404).json({ error: "Booking not found" })
      return
    }

    // Update booking status
    await sequelize.query(`UPDATE bookings SET booking_status = :status WHERE id = :id`, {
      replacements: { id, status },
      type: QueryTypes.UPDATE,
    })

    res.status(200).json({ message: "Booking status updated successfully" })
  } catch (error) {
    console.error("Error updating booking status:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
