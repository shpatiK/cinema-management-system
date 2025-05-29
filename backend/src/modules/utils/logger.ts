import { ActivityLog, type IActivityLog } from "../models/ActivityLog"
import type { Request } from "express"
import type { AuthenticatedRequest } from "../middlewares/authenticateToken"

export class Logger {
  /**
   * Log user activity
   */
  static async logActivity(data: Partial<IActivityLog>): Promise<void> {
    try {
      const log = new ActivityLog({
        timestamp: new Date(),
        level: data.level || "INFO",
        ...data,
      })

      await log.save()
      console.log(`📝 Activity logged: ${data.action} by ${data.username || "System"}`)
    } catch (error) {
      console.error("❌ Failed to log activity:", error)
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Log user authentication events
   */
  static async logAuth(
    action: "LOGIN" | "LOGOUT" | "REGISTER" | "ACTIVATION" | "LOGIN_FAILED",
    req: Request,
    userId?: number,
    username?: string,
    additionalData?: any,
  ): Promise<void> {
    await this.logActivity({
      userId,
      username,
      action,
      resource: "AUTH",
      details: {
        method: req.method,
        endpoint: req.originalUrl,
        userAgent: req.get("User-Agent"),
        ip: req.ip || req.connection.remoteAddress,
        metadata: additionalData,
      },
      level: action === "LOGIN_FAILED" ? "WARN" : "INFO",
    })
  }

  /**
   * Log CRUD operations
   */
  static async logCRUD(
    action: "CREATE" | "READ" | "UPDATE" | "DELETE",
    resource: "USER" | "MOVIE" | "BOOKING",
    req: AuthenticatedRequest,
    resourceId?: number,
    oldData?: any,
    newData?: any,
  ): Promise<void> {
    await this.logActivity({
      userId: req.user?.id,
      username: (req.user as { id: number; role: string; username?: string })?.username,
      action: `${action}_${resource}`,
      resource,
      resourceId,
      details: {
        method: req.method,
        endpoint: req.originalUrl,
        userAgent: req.get("User-Agent"),
        ip: req.ip || req.connection.remoteAddress,
        oldData,
        newData,
      },
      level: "INFO",
    })
  }

  /**
   * Log errors
   */
  static async logError(
    error: Error,
    req: Request,
    userId?: number,
    username?: string,
    additionalContext?: any,
  ): Promise<void> {
    await this.logActivity({
      userId,
      username,
      action: "ERROR",
      resource: "SYSTEM",
      details: {
        method: req.method,
        endpoint: req.originalUrl,
        userAgent: req.get("User-Agent"),
        ip: req.ip || req.connection.remoteAddress,
        errorMessage: error.message,
        metadata: {
          stack: error.stack,
          ...additionalContext,
        },
      },
      level: "ERROR",
    })
  }

  /**
   * Log system events
   */
  static async logSystem(
    action: string,
    details?: any,
    level: "INFO" | "WARN" | "ERROR" | "DEBUG" = "INFO",
  ): Promise<void> {
    await this.logActivity({
      action,
      resource: "SYSTEM",
      details: {
        metadata: details,
      },
      level,
    })
  }

  /**
   * Get activity logs with filtering and pagination
   */
  static async getLogs(
    filters: {
      userId?: number
      action?: string
      resource?: string
      level?: string
      startDate?: Date
      endDate?: Date
      page?: number
      limit?: number
    } = {},
  ): Promise<{
    logs: IActivityLog[]
    total: number
    page: number
    totalPages: number
  }> {
    const { userId, action, resource, level, startDate, endDate, page = 1, limit = 50 } = filters

    // Build query
    const query: any = {}

    if (userId) query.userId = userId
    if (action) query.action = new RegExp(action, "i")
    if (resource) query.resource = resource
    if (level) query.level = level

    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) query.timestamp.$gte = startDate
      if (endDate) query.timestamp.$lte = endDate
    }

    // Execute query with pagination
    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      ActivityLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      ActivityLog.countDocuments(query),
    ])

    return {
      logs: logs as IActivityLog[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Get activity statistics
   */
  static async getStats(days = 7): Promise<{
    totalLogs: number
    errorCount: number
    userActions: number
    systemActions: number
    topActions: Array<{ action: string; count: number }>
    dailyActivity: Array<{ date: string; count: number }>
  }> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [totalLogs, errorCount, userActions, systemActions, topActions, dailyActivity] = await Promise.all([
      // Total logs in period
      ActivityLog.countDocuments({
        timestamp: { $gte: startDate },
      }),

      // Error count
      ActivityLog.countDocuments({
        timestamp: { $gte: startDate },
        level: "ERROR",
      }),

      // User actions (has userId)
      ActivityLog.countDocuments({
        timestamp: { $gte: startDate },
        userId: { $exists: true },
      }),

      // System actions (no userId)
      ActivityLog.countDocuments({
        timestamp: { $gte: startDate },
        userId: { $exists: false },
      }),

      // Top actions
      ActivityLog.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { action: "$_id", count: 1, _id: 0 } },
      ]),

      // Daily activity
      ActivityLog.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", count: 1, _id: 0 } },
      ]),
    ])

    return {
      totalLogs,
      errorCount,
      userActions,
      systemActions,
      topActions,
      dailyActivity,
    }
  }
}