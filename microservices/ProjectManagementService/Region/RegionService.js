const RegionRepository = require('./RegionRepository');

const ListType = Object.freeze({
    SUBSCRIPTION: 'subscriptionList',
    NOTIFICATION: 'notificationList',
});

class RegionService {
    async subscribe(regionId, donorId){
        try {
            if(!regionId) throw new Error("No Region Id provided ");

            if(!donorId) throw new Error("No Donor Id provided ");

            const Region = await RegionRepository.findById(regionId);
            if(!Region) throw new Error("Region not found");

            if (!Region.subscriptionList.includes(donorId)) {
                await RegionRepository.push(regionId, donorId, ListType.SUBSCRIPTION); 
                return "Subscribe Successfully";
            }

            return `You already subscribed to the ${Region.name} Region`;
        } catch (error){
            throw new Error(error.message);
        }
    } 

    async notificationOn(regionId, donorId){
        try {
            if(!regionId) throw new Error("No Region Id provided ");

            if(!donorId) throw new Error("No Donor Id provided ");

            const Region = await RegionRepository.findById(regionId);
            if(!Region) throw new Error("Region not found");

            if (!Region.subscriptionList.includes(donorId)) {
                await RegionRepository.push(regionId, donorId, ListType.SUBSCRIPTION); 
                throw new Error(`You have not subscribed to the ${Region.name} Region`);
            }

            if (!Region.notificationList.includes(donorId)) {
                await RegionRepository.push(regionId, donorId, ListType.NOTIFICATION); 
                return `Notification for the ${Region.name} is turned on`;
            }

            return `The Notification is already on`;
        } catch (error){
            throw new Error(error.message);
        }
    } 

    async unsubscribe(regionId, donorId){
        try {
            if(!regionId) throw new Error("No Region Id provided ");

            if(!donorId) throw new Error("No Donor Id provided ");

            const Region = await RegionRepository.findById(regionId);
            if(!Region) throw new Error("Region not found");

            if (Region.subscriptionList.includes(donorId)) {
                await RegionRepository.pull(regionId, donorId, ListType.SUBSCRIPTION); 
                return "Unsubscribe Successfully";
            }

            return `You haven't subscribed to the ${Region.name} Region yet.`;
        } catch (error){
            throw new Error(error.message);
        }
    } 

    async notificationOff(regionId, donorId){
        try {
            if(!regionId) throw new Error("No Region Id provided ");

            if(!donorId) throw new Error("No Donor Id provided ");

            const Region = await RegionRepository.findById(regionId);
            if(!Region) throw new Error("Region not found");

            if (!Region.subscriptionList.includes(donorId)) {
                await RegionRepository.push(regionId, donorId, ListType.SUBSCRIPTION); 
                throw new Error(`You have not subscribed to the ${Region.name} Region`);
            }

            if (Region.notificationList.includes(donorId)) {
                await RegionRepository.pull(regionId, donorId, ListType.NOTIFICATION); 
                return `Notification for the ${Region.name} is turned off`;
            }

            return `The Notification is already off`;
        } catch (error){
            throw new Error(error.message);
        }
    }

    async getRegionById(id){
        try {
            const region = await RegionRepository.findById(id);
            return region;
        } catch(error){
            throw new Error(error.message);
        }
    }
}

module.exports = new RegionService();