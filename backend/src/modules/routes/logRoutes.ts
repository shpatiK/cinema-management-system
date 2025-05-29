import { Router } from "express"
import { LogController } from "../controllers/LogController"
import { authenticateToken } from "../middlewares/authenticateToken"
import { checkAdminRole } from "../middlewares/checkAdminRole"

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: number
 *         username:
 *           type: string
 *         action:
 *           type: string
 *         resource:
 *           type: string
 *         resourceId:
 *           type: number
 *         details:
 *           type: object
 *         level:
 *           type: string
 *           enum: [INFO, WARN, ERROR, DEBUG]
 *         timestamp:
 *           type: string
 *           format: date-time
 *     LogStats:
 *       type: object
 *       properties:
 *         totalLogs:
 *           type: number
 *         errorCount:
 *           type: number
 *         userActions:
 *           type: number
 *         systemActions:
 *           type: number
 *         topActions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *               count:
 *                 type: number
 *         dailyActivity:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               count:
 *                 type: number
 */

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Get activity logs (Admin only)
 *     tags: [Admin, Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: resource
 *         schema:
 *           type: string
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [INFO, WARN, ERROR, DEBUG]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActivityLog'
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     totalPages:
 *                       type: number
 */
router.get("/", authenticateToken, checkAdminRole, LogController.getLogs)

/**
 * @swagger
 * /api/admin/logs/stats:
 *   get:
 *     summary: Get activity log statistics (Admin only)
 *     tags: [Admin, Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Log statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LogStats'
 */
router.get("/stats", authenticateToken, checkAdminRole, LogController.getStats)

/**
 * @swagger
 * /api/admin/logs/export:
 *   get:
 *     summary: Export activity logs (Admin only)
 *     tags: [Admin, Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [INFO, WARN, ERROR, DEBUG]
 *     responses:
 *       200:
 *         description: Logs exported successfully
 */
router.get("/export", authenticateToken, checkAdminRole, LogController.exportLogs)

/**
 * @swagger
 * /api/admin/logs/clear:
 *   delete:
 *     summary: Clear old logs (Admin only)
 *     tags: [Admin, Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               days:
 *                 type: integer
 *                 default: 30
 *                 description: Keep logs from last N days
 *     responses:
 *       200:
 *         description: Logs cleared successfully
 */
router.delete("/clear", authenticateToken, checkAdminRole, LogController.clearLogs)

export default router