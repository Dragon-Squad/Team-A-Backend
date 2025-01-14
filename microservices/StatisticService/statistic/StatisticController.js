const StatisticService = require("./StatisticService");

class StatisticController {
    async getTotalDonation(req, res) {
        try {
            const country = req.query.country || null;
            const region = req.query.continent || null;
            const category = req.query.category || null;

            const url = await StatisticService.getTotalDonation(
                country,
                region,
                category
            );
            return res.status(200).json(url);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }

    async compareDonation(req, res) {
        try {
            const body = req.body;
            const result = await StatisticService.compareDonation(body);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }

    async getCharityProjectStatistic(req, res) {
        try {
            const charityId = req.body.charityId;
            const result = await StatisticService.getCharityProjectStatistic(
                charityId
            );
            return res.status(200).json(result);
        } catch (err) {
            return res.status(404).json({ error: err.message });
        }
    }
}

module.exports = new StatisticController();
