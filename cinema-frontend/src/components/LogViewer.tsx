"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  FaFilter,
  FaDownload,
  FaTrash,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaChartLine,
} from "react-icons/fa"

interface LogEntry {
  id: string
  timestamp: string
  level: string
  message: string
  metadata: any
}

interface StatsData {
  totalLogs: number
  errorLogs: number
  warningLogs: number
  infoLogs: number
}

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalLogsCount, setTotalLogsCount] = useState(0)
  const [filters, setFilters] = useState({
    level: "",
    message: "",
  })
  const [stats, setStats] = useState<StatsData | null>(null)
  const [statsPeriod, setStatsPeriod] = useState<number>(7)
  const [loading, setLoading] = useState(false)

  // Custom debounce hook replacement
  const [debouncedFilters, setDebouncedFilters] = useState(filters)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 500)

    return () => clearTimeout(timer)
  }, [filters])

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        level: debouncedFilters.level,
        message: debouncedFilters.message,
      })
      const response = await fetch(`/api/logs?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setLogs(data.logs)
      setTotalLogsCount(data.total)
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, debouncedFilters])

  const fetchStats = useCallback(
    async (days: number = statsPeriod) => {
      try {
        const response = await fetch(`/api/logs/stats?days=${days}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    },
    [statsPeriod],
  )

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const clearFilters = () => {
    setFilters({ level: "", message: "" })
  }

  // Native file download without file-saver
  const downloadLogs = async () => {
    try {
      const response = await fetch("/api/logs/download")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "logs.txt"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download logs:", error)
    }
  }

  const deleteLogs = async () => {
    if (window.confirm("Are you sure you want to delete all logs?")) {
      try {
        const response = await fetch("/api/logs/delete", { method: "DELETE" })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        setLogs([])
        setTotalLogsCount(0)
        setStats({
          totalLogs: 0,
          errorLogs: 0,
          warningLogs: 0,
          infoLogs: 0,
        })
        alert("Logs deleted successfully!")
      } catch (error) {
        console.error("Failed to delete logs:", error)
        alert("Failed to delete logs.")
      }
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleStatsPeriodChange = (days: number) => {
    setStatsPeriod(days)
    fetchStats(days)
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "text-red-600 bg-red-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "info":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Log Viewer</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
              </div>
              <FaEye className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">{stats.errorLogs}</p>
              </div>
              <FaChartLine className="text-red-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warningLogs}</p>
              </div>
              <FaChartLine className="text-yellow-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Info</p>
                <p className="text-2xl font-bold text-green-600">{stats.infoLogs}</p>
              </div>
              <FaChartLine className="text-green-500 text-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="message"
              placeholder="Filter by message"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={filters.message}
              onChange={handleFilterChange}
            />
            <select
              name="level"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={filters.level}
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              <FaFilter className="mr-2" />
              Clear Filters
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm disabled:opacity-50"
            >
              <FaSyncAlt className={`mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={downloadLogs}
              className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
            >
              <FaDownload className="mr-2" />
              Download
            </button>
            <button
              onClick={deleteLogs}
              className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
            >
              <FaTrash className="mr-2" />
              Delete All
            </button>
          </div>
        </div>

        {/* Stats Period Selector */}
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-sm text-gray-600">Period:</span>
          <button
            onClick={() => handleStatsPeriodChange(7)}
            className={`px-3 py-1 text-sm rounded ${
              statsPeriod === 7 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            7 days
          </button>
          <button
            onClick={() => handleStatsPeriodChange(30)}
            className={`px-3 py-1 text-sm rounded ${
              statsPeriod === 30 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            30 days
          </button>
          <button
            onClick={() => handleStatsPeriodChange(90)}
            className={`px-3 py-1 text-sm rounded ${
              statsPeriod === 90 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            90 days
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Activity Logs ({totalLogsCount} total)</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading logs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}
                        >
                          {log.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={log.message}>
                          {log.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => console.log("View details:", log)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalLogsCount > pageSize && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page * pageSize >= totalLogsCount}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * pageSize, totalLogsCount)}</span> of{" "}
                  <span className="font-medium">{totalLogsCount}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {page} of {Math.ceil(totalLogsCount / pageSize)}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page * pageSize >= totalLogsCount}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaChevronRight />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogViewer