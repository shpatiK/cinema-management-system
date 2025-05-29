import dotenv from "dotenv"
dotenv.config({ path: ".env" })
import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable")
}

export function generateToken(user: { id: number; role: string }): string {
  const payload = { id: user.id, role: user.role }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

// Token verification
export const verifyToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
}

// Authentication middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." })
    return
  }

  try {
    const decoded = verifyToken(token)
    ;(req as any).user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: "Invalid token." })
  }
}

// Role-checking middleware
export const checkRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if ((req as any).user?.role !== role) {
      res.status(403).json({ error: "Forbidden: Insufficient permissions" })
      return
    }
    next()
  }
}

// Admin middleware
export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!(req as any).user || (req as any).user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" })
    return
  }
  next()
}
