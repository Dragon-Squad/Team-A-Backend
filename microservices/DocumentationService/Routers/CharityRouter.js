const express = require('express');
const CharityController = require('./CharityController');
const CharityRouter = express.Router();

/**
 * @swagger
 * /charity/payment-method/{id}:
 *   patch:
 *     tags: [Charity]
 *     summary: Update charity payment method
 *     description: Updates the payment method for a charity by attaching a new payment method to the charity's Stripe account.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the charity to update the payment method for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethodId:
 *                 type: string
 *                 description: The ID of the new payment method to attach to the charity's Stripe account.
 *     responses:
 *       200:
 *         description: Payment method updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Payment method updated successfully'
 *       400:
 *         description: Invalid input or missing payment method
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Payment Method is not provided'
 *       404:
 *         description: Charity not found or Stripe User ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Charity not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
CharityRouter.patch(
    '/payment-method/:id', 
    CharityController.updatePaymentMethod
);

module.exports = CharityRouter;