const MonthlyDonationService = require("./MonthlyDonationService");

class MonthlyDonationController {
    async getAllMonthlyDonations(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, sortField, sortOrder } = req.query;

        try {
            const result = await MonthlyDonationService.getAllMonthlyDonations(
                page,
                limit,
                status,
                sortField,
                sortOrder
            );
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllMonthlyDonationsByDonor(req, res) {
        const donorId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, sortField, sortOrder } = req.query;

        try {
            const result =
                await MonthlyDonationService.getAllMonthlyDonationsByDonor(
                    page,
                    limit,
                    donorId,
                    status,
                    sortField,
                    sortOrder
                );
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMonthlyDonationsByProject(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const projectId = req.params.id;
            const results =
                await MonthlyDonationService.getMonthlyDonationsByProject(
                    limit,
                    page,
                    projectId
                );
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMonthlyDonationById(req, res) {
        const monthlyDonationId = req.params.id;
        try {
            const result = await MonthlyDonationService.getMonthlyDonationById(
                monthlyDonationId
            );
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        const monthlyDonationId = req.params.id;
        const data = req.body;
        try {
            const updatedDonation = await MonthlyDonationService.update(
                monthlyDonationId,
                data
            );
            res.status(200).json(updatedDonation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async cancel(req, res) {
        const monthlyDonationId = req.params.id;
        try {
            const canceledDonation = await MonthlyDonationService.cancel(
                monthlyDonationId
            );
            res.status(200).json(canceledDonation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new MonthlyDonationController();
