const CategoryService = require('./CategoryService');

class CategoryController {
    async subscribe(req, res) {
        try {
            const categoryId = req.params.id;
            const { donorId } = req.body;
            const result = await CategoryService.subscribe(categoryId, donorId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async notificationOn(req, res) {
        try {
            const categoryId = req.params.id;
            const { donorId } = req.body;
            const result = await CategoryService.notificationOn(categoryId, donorId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async unsubscribe(req, res) {
        try {
            const categoryId = req.params.id;
            const { donorId } = req.body;
            const result = await CategoryService.unsubscribe(categoryId, donorId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async notificationOff(req, res) {
        try {
            const categoryId = req.params.id;
            const { donorId } = req.body;
            const result = await CategoryService.notificationOff(categoryId, donorId);
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getCategoryById(req, res){
        try {
            const categoryId = req.params.id;
            const result = await CategoryService.getCategoryById(categoryId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new CategoryController();
