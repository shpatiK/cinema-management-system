import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateToken } from "../utils/auth" // This should match your file structure
import User from "../models/User"
import { sendActivationEmail } from "../utils/email" // Update path to match your structure

class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, email } = req.body

      const existingUser = await User.findOne({ where: { username } })
      if (existingUser) {
        res.status(400).json({ error: "Username already exists" })
        return
      }

      const existingEmail = await User.findOne({ where: { email } })
      if (existingEmail) {
        res.status(400).json({ error: "Email already exists" })
        return
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({
        username,
        password: hashedPassword,
        email,
        isActive: false,
        role: "user",
      })

      const activationToken = generateToken({ id: user.id, role: user.role })
      // Send activation email with token
      await sendActivationEmail(email, activationToken)

      res.status(201).json({
        message: "Registration successful! Check your email to activate your account.",
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ error: "Registration failed" })
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body

      const user = await User.findOne({ where: { username } })
      if (!user || !user.isActive) {
        res.status(401).json({ error: "Account not activated or invalid credentials" })
        return
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        res.status(401).json({ error: "Invalid credentials" })
        return
      }

      const token = generateToken({ id: user.id, role: user.role })

      // Return both token and user info for dashboard
      res.status(200).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ error: "Login failed" })
    }
  }

  static async activate(req: Request, res: Response): Promise<void> {
    try {
      const token = req.query.token as string
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload

      const user = await User.findByPk(decoded.id)
      if (!user) {
        res.status(404).json({ error: "User not found" })
        return
      }

      user.isActive = true
      await user.save()

      // Auto-login after activation - generate new token
      const loginToken = generateToken({ id: user.id, role: user.role })

      res.status(200).json({
        message: "Account activated successfully",
        token: loginToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      console.error("Activation error:", error)
      res.status(400).json({ error: "Invalid or expired activation token" })
    }
  }

  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id

      const user = await User.findByPk(userId, {
        attributes: ["id", "username", "email", "role"],
      })

      if (!user) {
        res.status(404).json({ message: "User not found" })
        return
      }

      res.json(user)
    } catch (error) {
      console.error("Fetch user error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id
      const { username, email } = req.body

      const user = await User.findByPk(userId)
      if (!user) {
        res.status(404).json({ message: "User not found" })
        return
      }

      // Check if username is already taken by another user
      if (username !== user.username) {
        const existingUser = await User.findOne({
          where: { username },
        })
        if (existingUser && existingUser.id !== userId) {
          res.status(400).json({ error: "Username already exists" })
          return
        }
      }

      // Check if email is already taken by another user
      if (email !== user.email) {
        const existingEmail = await User.findOne({
          where: { email },
        })
        if (existingEmail && existingEmail.id !== userId) {
          res.status(400).json({ error: "Email already exists" })
          return
        }
      }

      user.username = username
      user.email = email
      await user.save()

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
}

export default AuthController
