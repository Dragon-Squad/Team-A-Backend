const axios = require("axios");

async function getDonor(accessToken){
    const response = await axios.get(
        `http://172.30.208.1:3000/api/donors/my`,
        {
            credentials: "include",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: `accessToken=${accessToken}`,
            }
        }
      );
    if (!response.data) {
        throw new Error("Error validating donor ID");
    }
    return response.data;
}

async function getUser(userId){
    const response = await axios.get(
        `http://172.30.208.1:3000/api/users/${userId}`,
      );
    if (!response.data) {
        throw new Error("Error validating user ID");
    }
    return response.data;
}

module.exports = { getDonor, getUser };