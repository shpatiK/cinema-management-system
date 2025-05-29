import api from "./api"

export interface ActivityLog {
  _id: string
  userId?: number
  username?: string
  action: string
  resource?: string
  resourceId?: number
  details: {
    method?: string
    endpoint?: string
    userAgent?: string
    ip?: string
    statusCode?: number
    errorMessage?: string
    oldData?: any
    newData?: any
    metadata?: any
  }
  level: "INFO" | "WARN" | "ERROR" | "DEBUG"
  timestamp: string
  sessionId?: string
}

export interface LogStats {
  totalLogs: number
  errorCount: number
  userActions: number
  systemActions: number
  topActions: Array<{ action: string; count: number }>
  dailyActivity: Array<{ date: string; count: number }>
}

export interface LogFilters {
  page?: number
  limit?: number
  userId?: number
  action?: string
  resource?: string
  level?: string
  startDate?: string
  endDate?: string
}

export interface LogResponse {
  logs: ActivityLog[]
  total: number
  page: number
  totalPages: number
}

export const logService = {
  /**
   * Fetch activity logs with filtering and pagination
   */
  async getLogs(filters: LogFilters = {}): Promise<LogResponse> {
    try {
      console.log("📊 Fetching activity logs with filters:", filters)

      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      const response = await api.get(`/api/admin/logs?${params.toString()}`)
      console.log("📊 Activity logs fetched:", response.data)

      return response.data.data
    } catch (error) {
      console.error("Error fetching activity logs:", error)
      throw error
    }
  },

  /**
   * Get activity log statistics
   */
  async getStats(days = 7): Promise<LogStats> {
    try {
      console.log(`📈 Fetching log statistics for ${days} days`)

      const response = await api.get(`/api/admin/logs/stats?days=${days}`)
      console.log("📈 Log statistics fetched:", response.data)

      return response.data.data
    } catch (error) {
      console.error("Error fetching log statistics:", error)
      throw error
    }
  },

  /**
   * Export logs
   */
  async exportLogs(format: "json" | "csv" = "json", filters: Partial<LogFilters> = {}): Promise<void> {
    try {
      console.log(`📤 Exporting logs in ${format} format`)

      const params = new URLSearchParams()
      params.append("format", format)
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      const response = await api.get(`/api/admin/logs/export?${params.toString()}`, {
        responseType: "blob",
      })

      // Create download link
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `activity_logs.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log("📤 Logs exported successfully")
    } catch (error) {
      console.error("Error exporting logs:", error)
      throw error
    }
  },

  /**
   * Clear old logs
   */
  async clearLogs(days = 30): Promise<{ message: string }> {
    try {
      console.log(`🗑️ Clearing logs older than ${days} days`)

      const response = await api.delete("/api/admin/logs/clear", {
        data: { days },
      })

      console.log("🗑️ Logs cleared successfully:", response.data)
      return response.data
    } catch (error) {
      console.error("Error clearing logs:", error)
      throw error
    }
  },

  /**
   * Format log level for display
   */
  formatLevel(level: string): { color: string; icon: string } {
    switch (level) {
      case "ERROR":
        return { color: "text-red-600 bg-red-100", icon: "🔴" }
      case "WARN":
        return { color: "text-yellow-600 bg-yellow-100", icon: "🟡" }
      case "DEBUG":
        return { color: "text-purple-600 bg-purple-100", icon: "🟣" }
      default:
        return { color: "text-blue-600 bg-blue-100", icon: "🔵" }
    }
  },

  /**
   * Format action for display
   */
  formatAction(action: string): string {
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  },

  /**
   * Get relative time string
   */
  getRelativeTime(timestamp: string): string {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return time.toLocaleDateString()
  },
}
