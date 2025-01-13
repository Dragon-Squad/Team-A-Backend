const CategoryRepository = require("./CategoryRepository");
const axios = require("axios");
const { getDonor, fetchUserEmail } = require("../../utils/donnorServiceUtils");

const ListType = Object.freeze({
    SUBSCRIPTION: "subscriptionList",
    NOTIFICATION: "notificationList",
});



async function getCategoryById(categoryId) {
    if (!categoryId) throw new Error("No Category Id provided");

    const category = await CategoryRepository.findById(categoryId);
    if (!category) throw new Error("Category not found");

    return category;
}

async function ensureSubscribed(category, categoryId, userId) {
    if (!category.subscriptionList.includes(userId)) {
        await CategoryRepository.push(
            categoryId,
            userId,
            ListType.SUBSCRIPTION
        );
        throw new Error(
            `You have not subscribed to the ${category.name} Category`
        );
    }
}

class CategoryService {
    async subscribe(categoryId, userId, accessToken) {
        try {
            const donor = await getDonor(accessToken);
            const category = await getCategoryById(categoryId);

            if (!category.subscriptionList.includes(userId)) {
                await CategoryRepository.push(
                    categoryId,
                    userId,
                    ListType.SUBSCRIPTION
                );
                return "Subscribe Successfully";
            }

            return `You already subscribed to the ${category.name} Category`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async notificationOn(categoryId, userId, accessToken) {
        try {
            const donor = await getDonor(accessToken);
            // const userId = donor.userId;
            const donorEmail = await fetchUserEmail(userId);
            console.log(donorEmail);
            const category = await getCategoryById(categoryId);

            await ensureSubscribed(category, categoryId, userId);

            if (
                category.notificationList.some(
                    (notification) => notification.email === donorEmail
                )
            ) {
                return `The Notification for the ${category.name} is already on`;
            }

            const notification = {
                email: donorEmail,
                name: `${donor.firstName} ${donor.lastName}`,
            };
            await CategoryRepository.push(
                categoryId,
                notification,
                ListType.NOTIFICATION
            );

            return `Notification for the ${category.name} is turned on`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async unsubscribe(categoryId, userId, accessToken) {
        try {
            const donor = await getDonor(accessToken);
            // const userId = donor.userId;
            const donorEmail = await fetchUserEmail(userId);
            const category = await getCategoryById(categoryId);

            if (category.subscriptionList.includes(userId)) {
                await CategoryRepository.pull(
                    categoryId,
                    userId,
                    ListType.SUBSCRIPTION
                );

                if (
                    category.notificationList.some(
                        (notification) => notification.email === donorEmail
                    )
                ) {
                    const notification = {
                        email: donorEmail,
                        name: `${donor.firstName} ${donor.lastName}`,
                    };
                    await CategoryRepository.pull(
                        categoryId,
                        notification,
                        ListType.NOTIFICATION
                    );
                }

                return "Unsubscribe Successfully";
            }

            return `You haven't subscribed to the ${category.name} Category yet.`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async notificationOff(categoryId, userId, accessToken) {
        try {
            const donor = await getDonor(accessToken);
            // const userId = donor.userId;
            const donorEmail = await fetchUserEmail(userId);
            const category = await getCategoryById(categoryId);

            await ensureSubscribed(category, categoryId, userId);

            if (
                !category.notificationList.some(
                    (notification) => notification.email === donorEmail
                )
            ) {
                return `The Notification for the ${category.name} is already off`;
            }

            const notification = {
                email: donorEmail,
                name: `${donor.firstName} ${donor.lastName}`,
            };
            await CategoryRepository.pull(
                categoryId,
                notification,
                ListType.NOTIFICATION
            );

            return `Notification for the ${category.name} is turned off`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCategoryById(id) {
        try {
            const category = await CategoryRepository.findById(id);
            return category;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllCategories() {
        try {
            const categories = await CategoryRepository.getAll();
            delete categories.subscriptionList;
            delete categories.notificationList;
            return categories;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new CategoryService();
