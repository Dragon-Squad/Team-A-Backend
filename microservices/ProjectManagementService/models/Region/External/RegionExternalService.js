const RegionRepository = require("../RegionRepository");

class RegionExternalService {
    async getRegionNamesByIds(ids) {
        try {
            let names = [];
            for (const id of ids) {
                const region = await RegionRepository.findById(id);
                names.push(region.name);
            }
            return names;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new RegionExternalService();
