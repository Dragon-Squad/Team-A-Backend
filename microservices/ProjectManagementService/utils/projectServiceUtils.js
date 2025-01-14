const CategoryService = require("../models/Category/CategoryService");
const RegionService = require("../models/Region/RegionService");
const axios = require("axios");

const TEAM_B_BACKEND_URL =
    process.env.TEAM_B_BACKEND_URL ||
    "https://team-b-backend.tail8c88ab.ts.net:3000/api";

module.exports = {
    validateCharity: async function (charityId, accessToken) {
        const charityResponse = await axios.get(
            TEAM_B_BACKEND_URL + `/charities/by-charity-id/${charityId}`,
            {
                credentials: "include",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `accessToken=${accessToken}`,
                },
            }
        );
        if (!charityResponse.data) throw new Error("No Charity Found");

        return charityResponse.data;
    },

    validateCharityName: async function (keyword, accessToken) {
        const charityResponse = await axios.get(
            TEAM_B_BACKEND_URL + `/charities/search?keyword=${keyword}`,
            {
                credentials: "include",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `accessToken=${accessToken}`,
                },
            }
        );
        //if (!charityResponse.data) throw new Error("No Charity Found");

        return charityResponse.data;
    },

    validateUser: async function (userId) {
        const userResponse = await axios.get(
            TEAM_B_BACKEND_URL + `/users/${userId}`
        );
        if (!userResponse.data) throw new Error("No Email Found");

        return userResponse.data;
    },

    validateCategory: async function (categoryIds) {
        const categories = [];

        for (const categoryId of categoryIds) {
            const category = await CategoryService.getCategoryById(categoryId);
            if (!category) {
                throw new Error("Error validating category ID");
            }
            categories.push(category);
        }
        return categories;
    },

    validateRegion: async function (regionId) {
        const region = await RegionService.getRegionById(regionId);
        if (!region) throw new Error("Error validating region ID");

        return region;
    },

    mergeNotificationLists: function (region, categories) {
        console.log(region);
        console.log(categories);
        const notificationList = new Set();
        const userList = new Set();

        categories.forEach((category) => {
            category.notificationList.forEach((item) => userList.add(item));
        });

        region.notificationList.forEach((item) => userList.add(item));

        categories.forEach((category) => {
            category.notificationList.forEach((item) =>
                notificationList.add(item)
            );
        });

        region.notificationList.forEach((item) => notificationList.add(item));

        return {
            notificationList: [...notificationList],
            userList: [...userList],
        };
    },
};
