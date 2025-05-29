import type { Response } from "express"
import { Logger } from "../utils/logger"
import type { AuthenticatedRequest } from "../middlewares/authenticateToken"

export class LogController {
  /**
   * Get activity logs with filtering and pagination
   */
  static async getLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId, action, resource, level, startDate, endDate, page = 1, limit = 50 } = req.query

      const filters: any = {
        page: Number.parseInt(page as string),
        limit: Math.min(Number.parseInt(limit as string), 100), // Max 100 per page
      }

      if (userId) filters.userId = Number.parseInt(userId as string)
      if (action) filters.action = action as string
      if (resource) filters.resource = resource as string
      if (level) filters.level = level as string
      if (startDate) filters.startDate = new Date(startDate as string)
      if (endDate) filters.endDate = new Date(endDate as string)

      const result = await Logger.getLogs(filters)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      console.error("Error fetching logs:", error)
      res.status(500).json({
        success: false,
        error: "Failed to fetch logs",
      })
    }
  }

  /**
   * Get activity statistics
   */
  static async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { days = 7 } = req.query
      const stats = await Logger.getStats(Number.parseInt(days as string))

      res.json({
        success: true,
        data: stats,
      })
    } catch (error) {
      console.error("Error fetching log stats:", error)
      res.status(500).json({
        success: false,
        error: "Failed to fetch log statistics",
      })
    }
  }

  /**
   * Clear old logs (admin only)
   */
  static async clearLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { days = 30 } = req.body
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      const result = await Logger.logActivity({
        userId: req.user?.id,
        username: req.user?.username,
        action: "CLEAR_LOGS",
        resource: "SYSTEM",
        details: {
          cutoffDate: cutoffDate.toISOString(),
          daysKept: days,
        },
        level: "INFO",
      })

      res.json({
        success: true,
        message: `Logs older than ${days} days have been cleared`,
      })
    } catch (error) {
      console.error("Error clearing logs:", error)
      res.status(500).json({
        success: false,
        error: "Failed to clear logs",
      })
    }
  }

  /**
   * Export logs (admin only)
   */
  static async exportLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const rawFormat = req.query.format
      const format = typeof rawFormat === "string" ? rawFormat : "json"
      const { startDate, endDate, level } = req.query

      const filters: any = { limit: 10000 } // Large limit for export
      if (startDate) filters.startDate = new Date(startDate as string)
      if (endDate) filters.endDate = new Date(endDate as string)
      if (level) filters.level = level as string

      const result = await Logger.getLogs(filters)

      // Log the export action
      await Logger.logActivity({
        userId: req.user?.id,
        username: req.user?.username,
        action: "EXPORT_LOGS",
        resource: "SYSTEM",
        details: {
          format,
          filters,
          exportedCount: result.logs.length,
        },
        level: "INFO",
      })

      if (format === "csv") {
        // Convert to CSV
        const csvHeader = "Timestamp,User,Action,Resource,Level,Details\n"
        const csvRows = result.logs
          .map((log) => {
            const details = JSON.stringify(log.details).replace(/"/g, '""')
            return `"${log.timestamp}","${log.username || "System"}","${log.action}","${log.resource || ""}","${log.level}","${details}"`
          })
          .join("\n")

        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=activity_logs.csv")
        res.send(csvHeader + csvRows)
      } else {
        // JSON format
        res.setHeader("Content-Type", "application/json")
        res.setHeader("Content-Disposition", "attachment; filename=activity_logs.json")
        res.json(result)
      }
    } catch (error) {
      console.error("Error exporting logs:", error)
      res.status(500).json({
        success: false,
        error: "Failed to export logs",
      })
    }
  }
}