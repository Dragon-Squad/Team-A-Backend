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
}

module.exports = new DonationController();