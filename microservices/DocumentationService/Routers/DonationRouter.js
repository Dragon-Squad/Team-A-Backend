const express = require('express');
const DonationController = require('./DonationController');
const DonationRouter = express.Router();

/**
 * @swagger
 * /donation/new:
 *   post:
 *     tags: [Donation]
 *     summary: Create a new donation
 *     description: Creates a new donation and initiates a donation session using Stripe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the donor.
 *                 example: "donor1@gmail.com"
 *               personalMessage:
 *                 type: string
 *                 description: A personal message from the donor (optional).
 *                 example: "Keep up the great work!"
 *               projectId:
 *                 type: string
 *                 description: The ID of the project receiving the donation.
 *                 example: "60b6a6f8c1a2b8c8d4f1b0b6"
 *               monthlyDonationId:
 *                 type: string
 *                 description: The ID of the monthly donation plan (optional).
 *               amount:
 *                 type: float
 *                 description: The amount to donate in dollars.
 *                 example: 50.00
 *     responses:
 *       200:
 *         description: Donation session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkoutUrl:
 *                   type: string
 *                   description: The URL for the Stripe donation checkout session.
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Amount must be a valid positive number"
 *       404:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No Email provided"
 *       500:
 *         description: Failed to create donation session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create Stripe Checkout session: Server error"
 */
DonationRouter.post(
  '/new',
  DonationController.donate
);

/**
 * @swagger
 * /donation/all:
 *   get:
 *     tags: [Donation]
 *     summary: Get all donations
 *     description: Fetches all donations with pagination.
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of donations to return (default is 10).
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number to fetch (default is 1).
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of donations with pagination information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages available.
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       description: The current page being viewed.
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       description: The number of donations per page.
 *                       example: 10
 *                     isLast:
 *                       type: boolean
 *                       description: Whether the current page is the last one.
 *                       example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the donation.
 *                         example: "6765072108576fff8bac4b1c"
 *                       projectId:
 *                         type: string
 *                         description: The ID of the project the donation was made to.
 *                         example: "675be5bceecd9bb35ff45689"
 *                       donationType:
 *                         type: string
 *                         description: Type of donation (e.g., one-time or monthly).
 *                         example: "one-time"
 *                       message:
 *                         type: string
 *                         description: A message provided with the donation.
 *                         example: "No message provided"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the donation was created.
 *                         example: "2024-12-20T05:56:49.442Z"
 *                       __v:
 *                         type: integer
 *                         description: The version key for the document in the database.
 *                         example: 0
 *       500:
 *         description: Failed to fetch donations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error: Unable to fetch donations"
 */

DonationRouter.get(
  '/all',
  DonationController.getAllDonations
)

/**
 * @swagger
 * /donation/{id}:
 *   get:
 *     tags: [Donation]
 *     summary: Get a donation by ID
 *     description: Fetches a donation by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the donation.
 *         schema:
 *           type: string
 *           example: "60b6a6f8c1a2b8c8d4f1b0b6"
 *     responses:
 *       200:
 *         description: Donation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique ID of the donation.
 *                   example: "6765072108576fff8bac4b1c"
 *                 projectId:
 *                   type: string
 *                   description: The ID of the project the donation was made to.
 *                   example: "675be5bceecd9bb35ff45689"
 *                 donationType:
 *                   type: string
 *                   description: Type of donation (e.g., one-time or monthly).
 *                   example: "one-time"
 *                 message:
 *                   type: string
 *                   description: A message provided with the donation.
 *                   example: "No message provided"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the donation was created.
 *                   example: "2024-12-20T05:56:49.442Z"
 *                 __v:
 *                   type: integer
 *                   description: The version key for the document in the database.
 *                   example: 0
 *       500:
 *         description: Failed to fetch donation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error: Unable to fetch donation"
 */

DonationRouter.get(
  '/:id',
  DonationController.getDonationById
)