const GuestDonationService = require("./GuestDonationService");

class GuestDonationController {
    // Method to call donate
    async donate(req, res) {
        try {
            const donateData = req.body;
            // const donorId = req.id;
            const url = await GuestDonationService.donation(donateData);
            return res.status(200).json(url);
            // return res.redirect(303, url);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }

    async getAllGuestDonations(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const results = await GuestDonationService.getAllGuestDonations(
                limit,
                page
            );
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getGuestDonationById(req, res) {
        try {
            const guestDonationId = req.params.id;
            const results = await GuestDonationService.getGuestDonationById(
                guestDonationId
            );
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getGuestDonationsByProject(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const projectId = req.params.id;
            const results =
                await GuestDonationService.getGuestDonationsByProject(
                    limit,
                    page,
                    projectId
                );
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new GuestDonationController();
