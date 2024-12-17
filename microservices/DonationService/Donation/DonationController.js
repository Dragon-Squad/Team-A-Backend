const DonationService = require('./DonationService');

class DonationController {
    // Method to call donate
    async donate(req, res) {
        try {
            const donateData = req.body;
            // const donorId = req.id;
            const url = await DonationService.donate(donateData);
            return res.status(200).json(url);
            // return res.redirect(303, url);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }

    async handleWebhook(req, res) {
        const signature = req.headers['stripe-signature'];
        try {
            const event = DonationService.verifyEvent(req.body, signature);
            DonationService.handleEvent(event);
            res.status(200).json({ received: true });
        } catch (err) {
            console.error(err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}

module.exports = new DonationController();