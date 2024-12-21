const express = require("express");
const AuthRouter = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const UserType = require('../User/enum/userType');
const {
  register,
  login,
  logout,
  verifyUser,
} = require("./AuthController");

// AuthRouter.post("/verify/:id", verifyUser);

/**
 * @swagger
 * /new:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided email, password, and role.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "donorpassword"
 *               role:
 *                 type: string
 *                 example: "Donor" 
 *             required:
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "JohnDoe@gmail.com"
 *                     role:
 *                       type: string
 *                       example: "Donor"
 *       400:
 *         description: Error creating user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
AuthRouter.post("/new", register);

// AuthRouter.post("/new/admin", authenticate, authorize([UserType.ADMIN]), register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user with email and password and returns a token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "donor1@gmail.com"
 *               password:
 *                 type: string
 *                 example: "donorpassword"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User authenticated successfully and token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User authenticated successfully"
 *       400:
 *         description: Error during authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password"
 */
AuthRouter.post("/login", login);

/**
 * @swagger
 * /logout:
 *   delete:
 *     summary: Logout a user
 *     description: Logs out a user by clearing the authentication token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *       401:
 *         description: Token not found or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token not found"
 */
AuthRouter.delete("/logout", authenticate, logout);

module.exports = AuthRouter;