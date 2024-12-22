const RegionService = require('./RegionService');

class RegionController {
    async subscribe(req, res) {
        try {
            const regionId = req.params.id;
            const { donorId } = req.body;
            const result = await RegionService.subscribe(regionId, donorId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async notificationOn(req, res) {
        try {
            const regionId = req.params.id;
            const { donorId } = req.body;
            const result = await RegionService.notificationOn(regionId, donorId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async unsubscribe(req, res) {
        try {
            const regionId = req.params.id;
            const { donorId } = req.body;
            const result = await RegionService.unsubscribe(regionId, donorId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async notificationOff(req, res) {
        try {
            const regionId = req.params.id;
            const { donorId } = req.body;
            const result = await RegionService.notificationOff(regionId, donorId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getRegionById(req, res){
        try {
            const regionId = req.params.id;
            const result = await RegionService.getRegionById(regionId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new RegionController();
