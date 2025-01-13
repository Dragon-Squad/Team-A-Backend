const axios = require("axios");

async function getDonor(accessToken) {
    const response = await axios.get(
        `https://team-b-backend.tail8c88ab.ts.net:3000/api/donors/my`,
        {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}`,
            },
        }
    );
    if (!response.data) {
        throw new Error("Error validating donor ID");
    }
    return response.data;
}

async function fetchUserEmail(donorId) {
    const response = await axios.get(
        `https://team-b-backend.tail8c88ab.ts.net:3000/api/donors/${donorId}/email`
    );
    if (!response.data) throw new Error("No Email Found");

    return response.data.email;
}

module.exports = { getDonor, fetchUserEmail };
