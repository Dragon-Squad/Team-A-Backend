const CategoryRepository = require("../CategoryRepository");

class CategoryExternalService {
    async getCategoryNamesByIds(ids) {
        try {
            let names = [];
            for (const id of ids) {
                const category = await CategoryRepository.findById(id);
                names.push(category.name);
            }
            return names;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new CategoryExternalService();
