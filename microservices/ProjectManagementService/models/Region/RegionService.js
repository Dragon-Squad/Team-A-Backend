const RegionRepository = require('./RegionRepository');
const axios = require("axios");

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

async function getRegionById(regionId) {
    if (!regionId) throw new Error("No Region Id provided");

    const region = await RegionRepository.findById(regionId);
    if (!region) throw new Error("Region not found");

    return region;
}

async function ensureSubscribed(region, regionId, donorId) {
    if (!region.subscriptionList.includes(donorId)) {
        await RegionRepository.push(regionId, donorId, ListType.SUBSCRIPTION);
        throw new Error(`You have not subscribed to the ${region.name} Region`);
    }
}

class RegionService {
    async subscribe(regionId, donorId){
        try {
            const donor = await fetchDonorDetails(donorId);
            const region = await getRegionById(regionId);

            if (!region.subscriptionList.includes(donorId)) {
                await RegionRepository.push(regionId, donorId, ListType.SUBSCRIPTION);
                return "Subscribe Successfully";
            }

            return `You already subscribed to the ${region.name} Region`;
        } catch (error){
            throw new Error(error.message);
        }
    } 

    async notificationOn(regionId, donorId){
        try {
            const donor = await fetchDonorDetails(donorId);
            const donorEmail = await fetchUserEmail(donorId);
            const region = await getRegionById(regionId);

            await ensureSubscribed(region, regionId, donorId);

            if (region.notificationList.some(notification => notification.email === donorEmail)) {
                return `The Notification for the ${region.name} is already on`;
            }

            const notification = { email: donorEmail, name: `${donor.firstName} ${donor.lastName}` };
            await RegionRepository.push(regionId, notification, ListType.NOTIFICATION);

            return `Notification for the ${region.name} is turned on`;
        } catch (error){
            throw new Error(error.message);
        }
    } 

    async unsubscribe(regionId, donorId){
        try {
            const donor = await fetchDonorDetails(donorId);
                        const donorEmail = await fetchUserEmail(donorId);
                        const region = await getRegionById(regionId);
            
                        if (region.subscriptionList.includes(donorId)) {
                            await RegionRepository.pull(regionId, donorId, ListType.SUBSCRIPTION);
            
                            if (region.notificationList.some(notification => notification.email === donorEmail)) {
                                const notification = { email: donorEmail, name: `${donor.firstName} ${donor.lastName}` };
                                await RegionRepository.pull(cregionId, notification, ListType.NOTIFICATION);
                            }
            
                            return "Unsubscribe Successfully";
                        }
            
                        return `You haven't subscribed to the ${region.name} Region yet.`;
        } catch (error){
            throw new Error(error.message);
        }
    } 

    async notificationOff(regionId, donorId){
        try {
            const donor = await fetchDonorDetails(donorId);
                        const donorEmail = await fetchUserEmail(donorId);
                        const region = await getRegionById(regionId);
            
                        await ensureSubscribed(region, regionId, donorId);
            
                        if (!region.notificationList.some(notification => notification.email === donorEmail)) {
                            return `The Notification for the ${region.name} is already off`;
                        }
            
                        const notification = { email: donorEmail, name: `${donor.firstName} ${donor.lastName}` };
                        await RegionRepository.pull(regionId, notification, ListType.NOTIFICATION);
            
                        return `Notification for the ${region.name} is turned off`;
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

    async getAllRegions(){
        try {
            const regions = await RegionRepository.getAll();
            delete regions.subscriptionList;
            delete regions.notificationList;
            return regions;
        } catch(error){
            throw new Error(error.message);
        }
    }
}

module.exports = new RegionService();