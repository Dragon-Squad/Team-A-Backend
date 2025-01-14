const CategoryService = require("./CategoryService");

class CategoryController {
    async subscribe(req, res) {
        try {
            const accessToken = req.cookies.accessToken;
            const categoryId = req.params.id;
            const { userId } = req;
            const result = await CategoryService.subscribe(
                categoryId,
                userId,
                accessToken
            );
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async notificationOn(req, res) {
        try {
            const accessToken = req.cookies.accessToken;
            const categoryId = req.params.id;
            const { userId } = req;
            const result = await CategoryService.notificationOn(
                categoryId,
                userId,
                accessToken
            );
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async unsubscribe(req, res) {
        try {
            const accessToken = req.cookies.accessToken;
            const categoryId = req.params.id;
            const { userId } = req;
            const result = await CategoryService.unsubscribe(
                categoryId,
                userId,
                accessToken
            );
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async notificationOff(req, res) {
        try {
            const accessToken = req.cookies.accessToken;
            const categoryId = req.params.id;
            const { userId } = req;
            const result = await CategoryService.notificationOff(
                categoryId,
                userId,
                accessToken
            );
            res.status(200).json({ message: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const categoryId = req.params.id;
            const result = await CategoryService.getCategoryById(categoryId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllCategories(req, res) {
        try {
            const result = await CategoryService.getAllCategories();
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new CategoryController();
