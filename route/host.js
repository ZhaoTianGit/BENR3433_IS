/**
 * @swagger
 * components:
 *   schemas:
 *     Visit:
 *       type: object
 *       required:
 *         - purposeOfVisit
 *         - phoneNumber
 *       properties:
 *         purposeOfVisit:
 *           type: string
 *           description: The purpose of the visit
 *         phoneNumber:
 *           type: number
 *           description: The phone number of the visitor
 *         visitTime:
 *           type: string
 *           format: date-time
 *           description: The time of the visit
 *       example:
 *         purposeOfVisit: Meeting
 *         phoneNumber: 1234567890
 *
 *     Visitor:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the visitor
 *         visits:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Visit'
 *       example:
 *         name: John Doe
 *         visits:
 *           - purposeOfVisit: Meeting
 *             phoneNumber: 1234567890
 *             visitTime: '2023-01-01T12:00:00Z'
 *
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - phoneNumber
 *         - category
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         phoneNumber:
 *           type: number
 *           description: The phone number of the user
 *         category:
 *           type: string
 *           enum:
 *             - host
 *             - admin
 *           description: The category of the user (host or admin)
 *         visitors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Visitor'
 *       example:
 *         username: user123
 *         password: password123
 *         email: user@exa\mple.com
 *         phoneNumber: 1234567890
 *         category: host
 *         visitors:
 *           - name: John Doe
 *             visits:
 *               - purposeOfVisit: Meeting
 *                 phoneNumber: 1234567890
 *                 visitTime: '2023-01-01T12:00:00Z'
 */

/**
 * @swagger
 * /host/{hostId}:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Get welcome message for a host
 *     description: Retrieve a welcome message for a specific host
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         description: ID of the host
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Welcome message
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 * 
 * /host/{hostId}/visitors:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Get visitors for a host
 *     description: Retrieve visitors registered under a specific host
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         description: ID of the host
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server Error
 */

// route/host.js
const express = require('express');
const router = express.Router();
const hostController = require('../controller/host');
const middleware = require('../middleware');

// Example route
router.get('/:hostId', middleware.authenticateToken('host'), hostController.getWelcomeMessage);
router.get('/:hostId/visitors', middleware.authenticateToken('host'), hostController.getVisitors);

module.exports = router;