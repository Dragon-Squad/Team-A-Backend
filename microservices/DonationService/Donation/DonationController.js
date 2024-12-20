const DonationService = require('./DonationService');

class DonationController {
    // Method to call donate
    async donate(req, res) {
        try {
            const donateData = req.body;
            // const donorId = req.id;
            const url = await DonationService.donation(donateData);
            return res.status(200).json(url);
            // return res.redirect(303, url);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }

    async getAllDonations(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const results = await DonationService.getAllDonations(limit, page);
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getDonationById(req, res) {
        try {
            const donationId = req.params.id;
            const results = await DonationService.getDonationById(donationId);
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getDonationsByDonor(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const donorId = req.params.id;
            const results = await DonationService.getDonationsByDonor(limit, page, donorId);
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getDonationsByProject(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const projectId = req.params.id;
            const results = await DonationService.getDonationsByProject(limit, page, projectId);
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new DonationController();