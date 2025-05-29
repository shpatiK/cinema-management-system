import { Schema, model, type Document } from "mongoose"

export interface IActivityLog extends Document {
  userId?: number // Reference to PostgreSQL user ID
  username?: string // Store username for quick access
  action: string // e.g., 'LOGIN', 'CREATE_MOVIE', 'DELETE_USER', etc.
  resource?: string // e.g., 'USER', 'MOVIE', 'SYSTEM'
  resourceId?: number // ID of the affected resource
  details: {
    method?: string // HTTP method
    endpoint?: string // API endpoint
    userAgent?: string // Browser/client info
    ip?: string // IP address
    statusCode?: number // Response status
    errorMessage?: string // Error details if any
    oldData?: any // Previous state (for updates)
    newData?: any // New state (for creates/updates)
    metadata?: any // Additional context
    cutoffDate?: string // For log cleanup actions
    daysKept?: number // For log cleanup actions
    format?: string // For export actions
    filters?: any // For export actions
    exportedCount?: number // For export actions
  }
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" // Log level
  timestamp: Date
  sessionId?: string // Track user sessions
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Number,
      required: false,
      index: true, // Index for faster queries
    },
    username: {
      type: String,
      required: false,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: false,
      index: true,
    },
    resourceId: {
      type: Number,
      required: false,
    },
    details: {
      method: String,
      endpoint: String,
      userAgent: String,
      ip: String,
      statusCode: Number,
      errorMessage: String,
      oldData: Schema.Types.Mixed,
      newData: Schema.Types.Mixed,
      metadata: Schema.Types.Mixed,
    },
    level: {
      type: String,
      enum: ["INFO", "WARN", "ERROR", "DEBUG"],
      default: "INFO",
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    sessionId: {
      type: String,
      required: false,
    },
  },
  {
    // Automatically delete logs older than 90 days
    expireAfterSeconds: 90 * 24 * 60 * 60,
  },
)

// Compound indexes for common queries
ActivityLogSchema.index({ timestamp: -1, level: 1 })
ActivityLogSchema.index({ userId: 1, timestamp: -1 })
ActivityLogSchema.index({ action: 1, timestamp: -1 })

export const ActivityLog = model<IActivityLog>("ActivityLog", ActivityLogSchema)