const CategoryRepository = require('./CategoryRepository');

const ListType = Object.freeze({
    SUBSCRIPTION: 'subscriptionList',
    NOTIFICATION: 'notificationList',
});

class CategoryService {
    async subscribe(categoryId, donorId){
        try {
            if(!categoryId) throw new Error("No Category Id provided ");

            if(!donorId) throw new Error("No Donor Id provided ");

            const category = await CategoryRepository.findById(categoryId);
            if(!category) throw new Error("Category not found");

            if (!category.subscriptionList.includes(donorId)) {
                await CategoryRepository.push(categoryId, donorId, ListType.SUBSCRIPTION); 
                return "Subscribe Successfully";
            }

            return `You already subscribed to the ${category.name} Category`;
        } catch (error){
            throw new Error(error.message);
        }
    } 

    async notificationOn(categoryId, donorId){
        try {
            if(!categoryId) throw new Error("No Category Id provided ");

            if(!donorId) throw new Error("No Donor Id provided ");

            const category = await CategoryRepository.findById(categoryId);
            if(!category) throw new Error("Category not found");

            if (!category.subscriptionList.includes(donorId)) {
                await CategoryRepository.push(categoryId, donorId, ListType.SUBSCRIPTION); 
                throw new Error(`You have not subscribed to the ${category.name} Category`);
            }

            if (!category.notificationList.includes(donorId)) {
                await CategoryRepository.push(categoryId, donorId, ListType.NOTIFICATION); 
                return `Notification for the ${category.name} is turned on`;
            }

            return `The Notification is already on`;
        } catch (error){
            throw new Error(error.message);
        }
    } 

    async unsubscribe(categoryId, donorId){
        try {
            if(!categoryId) throw new Error("No Category Id provided ");

            if(!donorId) throw new Error("No Donor Id provided ");

            const category = await CategoryRepository.findById(categoryId);
            if(!category) throw new Error("Category not found");

            if (category.subscriptionList.includes(donorId)) {
                await CategoryRepository.pull(categoryId, donorId, ListType.SUBSCRIPTION); 
                return "Unsubscribe Successfully";
            }

            return `You haven't subscribed to the ${category.name} Category yet.`;
        } catch (error){
            throw new Error(error.message);
        }
    } 

    async notificationOff(categoryId, donorId){
        try {
            if(!categoryId) throw new Error("No Category Id provided ");

            if(!donorId) throw new Error("No Donor Id provided ");

            const category = await CategoryRepository.findById(categoryId);
            if(!category) throw new Error("Category not found");

            if (!category.subscriptionList.includes(donorId)) {
                await CategoryRepository.push(categoryId, donorId, ListType.SUBSCRIPTION); 
                throw new Error(`You have not subscribed to the ${category.name} Category`);
            }

            if (category.notificationList.includes(donorId)) {
                await CategoryRepository.pull(categoryId, donorId, ListType.NOTIFICATION); 
                return `Notification for the ${category.name} is turned off`;
            }

            return `The Notification is already off`;
        } catch (error){
            throw new Error(error.message);
        }
    }

    async getCategoryById(id){
        try {
            const category = await CategoryRepository.findById(id);
            return category;
        } catch(error){
            throw new Error(error.message);
        }
    }
}

module.exports = new CategoryService();