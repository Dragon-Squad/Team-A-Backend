const WebhookService = require("./WebhookService");

class WebhookController {
    async handleWebhook(req, res) {
        const signature = req.headers["stripe-signature"];
        try {
            const event = WebhookService.verifyEvent(req.body, signature);
            WebhookService.handleEvent(event);
            res.status(200).json({ received: true });
        } catch (err) {
            console.error(err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}

module.exports = new WebhookController();
