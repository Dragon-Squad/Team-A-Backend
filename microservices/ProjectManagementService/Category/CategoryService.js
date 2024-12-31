const CategoryRepository = require('./CategoryRepository');

const ListType = Object.freeze({
    SUBSCRIPTION: 'subscriptionList',
    NOTIFICATION: 'notificationList',
});

async function fetchDonorDetails(donorId) {
    if (!donorId) throw new Error("No Donor Id provided");

    const donorResponse = await axios.get(`http://172.30.208.1:3000/api/donors/${donorId}`);
    if (!donorResponse.data) throw new Error("No Donor Found");

    return donorResponse.data;
}

async function fetchUserEmail(donorId) {
    const userResponse = await axios.get(`http://172.30.208.1:3000/api/users/${donorId}`);
    if (!userResponse.data) throw new Error("No Email Found");

    return userResponse.data.email;
}

async function getCategoryById(categoryId) {
    if (!categoryId) throw new Error("No Category Id provided");

    const category = await CategoryRepository.findById(categoryId);
    if (!category) throw new Error("Category not found");

    return category;
}

async function ensureSubscribed(category, categoryId, donorId) {
    if (!category.subscriptionList.includes(donorId)) {
        await CategoryRepository.push(categoryId, donorId, ListType.SUBSCRIPTION);
        throw new Error(`You have not subscribed to the ${category.name} Category`);
    }
}

class CategoryService {
    async subscribe(categoryId, donorId) {
        try {
            const donor = await fetchDonorDetails(donorId);
            const category = await getCategoryById(categoryId);

            if (!category.subscriptionList.includes(donorId)) {
                await CategoryRepository.push(categoryId, donorId, ListType.SUBSCRIPTION);
                return "Subscribe Successfully";
            }

            return `You already subscribed to the ${category.name} Category`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async notificationOn(categoryId, donorId) {
        try {
            const donor = await fetchDonorDetails(donorId);
            const donorEmail = await fetchUserEmail(donorId);
            const category = await getCategoryById(categoryId);

            await ensureSubscribed(category, categoryId, donorId);

            if (category.notificationList.some(notification => notification.email === donorEmail)) {
                return `The Notification for the ${category.name} is already on`;
            }

            const notification = { email: donorEmail, name: `${donor.firstName} ${donor.lastName}` };
            await CategoryRepository.push(categoryId, notification, ListType.NOTIFICATION);

            return `Notification for the ${category.name} is turned on`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async unsubscribe(categoryId, donorId) {
        try {
            const donor = await fetchDonorDetails(donorId);
            const donorEmail = await fetchUserEmail(donorId);
            const category = await getCategoryById(categoryId);

            if (category.subscriptionList.includes(donorId)) {
                await CategoryRepository.pull(categoryId, donorId, ListType.SUBSCRIPTION);

                if (category.notificationList.some(notification => notification.email === donorEmail)) {
                    const notification = { email: donorEmail, name: `${donor.firstName} ${donor.lastName}` };
                    await CategoryRepository.pull(categoryId, notification, ListType.NOTIFICATION);
                }

                return "Unsubscribe Successfully";
            }

            return `You haven't subscribed to the ${category.name} Category yet.`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async notificationOff(categoryId, donorId) {
        try {
            const donor = await fetchDonorDetails(donorId);
            const donorEmail = await fetchUserEmail(donorId);
            const category = await getCategoryById(categoryId);

            await ensureSubscribed(category, categoryId, donorId);

            if (!category.notificationList.some(notification => notification.email === donorEmail)) {
                return `The Notification for the ${category.name} is already off`;
            }

            const notification = { email: donorEmail, name: `${donor.firstName} ${donor.lastName}` };
            await CategoryRepository.pull(categoryId, notification, ListType.NOTIFICATION);

            return `Notification for the ${category.name} is turned off`;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new CategoryService();
