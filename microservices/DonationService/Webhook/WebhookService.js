require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { handleCheckoutSessionCompleted, handleCheckoutSessionExpired, handleInvoicePaymentSucceeded, handleInvoicePaymentFailed } = require('../utils/WebhookUtils');

class WebhookService {
    verifyEvent(payload, signature) {
        try {
            return stripe.webhooks.constructEvent(
                payload, 
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            throw new Error(`Webhook signature verification failed: ${err.message}`);
        }
    }

    async handleEvent(event) {
        const session = event.data.object;
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(session);
                break;

            case 'checkout.session.expired':
                await handleCheckoutSessionExpired(session);
                break;

            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(session);
                break;
            
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(session);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}

module.exports = new WebhookService();
