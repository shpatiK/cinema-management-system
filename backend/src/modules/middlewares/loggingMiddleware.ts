import type { Response, NextFunction } from "express"
import { Logger } from "../utils/logger"
import type { AuthenticatedRequest } from "./authenticateToken"

/**
 * Middleware to automatically log HTTP requests
 */
export const requestLoggingMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const startTime = Date.now()

  // Store original res.json to capture response
  const originalJson = res.json
  let responseData: any

  res.json = function (data: any) {
    responseData = data
    return originalJson.call(this, data)
  }

  // Log when response finishes
  res.on("finish", async () => {
    const duration = Date.now() - startTime
    const statusCode = res.statusCode

    // Skip logging for certain endpoints to avoid noise
    const skipPaths = ["/api-docs", "/posters", "/status"]
    const shouldSkip = skipPaths.some((path) => req.originalUrl.startsWith(path))

    if (shouldSkip) return

    // Determine log level based on status code
    let level: "INFO" | "WARN" | "ERROR" = "INFO"
    if (statusCode >= 400 && statusCode < 500) level = "WARN"
    if (statusCode >= 500) level = "ERROR"

    // Determine action based on method and path
    let action = `${req.method}_REQUEST`
    if (req.originalUrl.includes("/auth/login")) action = "LOGIN_ATTEMPT"
    if (req.originalUrl.includes("/auth/register")) action = "REGISTER_ATTEMPT"
    if (req.originalUrl.includes("/movies") && req.method === "POST") action = "CREATE_MOVIE"
    if (req.originalUrl.includes("/movies") && req.method === "PUT") action = "UPDATE_MOVIE"
    if (req.originalUrl.includes("/movies") && req.method === "DELETE") action = "DELETE_MOVIE"

    await Logger.logActivity({
      userId: req.user?.id,
      username: req.user?.username,
      action,
      resource: req.originalUrl.includes("/movies") ? "MOVIE" : req.originalUrl.includes("/users") ? "USER" : "SYSTEM",
      details: {
        method: req.method,
        endpoint: req.originalUrl,
        userAgent: req.get("User-Agent"),
        ip: req.ip || req.connection.remoteAddress,
        statusCode,
        metadata: {
          duration: `${duration}ms`,
          query: req.query,
          hasError: statusCode >= 400,
          errorMessage: statusCode >= 400 ? responseData?.error || responseData?.message : undefined,
        },
      },
      level,
    })
  })

  next()
}

/**
 * Middleware to log errors
 */
export const errorLoggingMiddleware = (
  err: Error,
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  // Log the error
  Logger.logError(err, req, req.user?.id, req.user?.username, {
    body: req.body,
    params: req.params,
    query: req.query,
  })

  next(err)
}