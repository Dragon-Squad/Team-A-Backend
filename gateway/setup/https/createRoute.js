const axios = require('axios');

// Function to create a route for a service
async function createRoute(serviceId, path) {
    try {
        const response = await axios.post('http://kong-gateway:8001/routes/', {
            name: `${serviceId}-route`, // Unique route name based on service ID
            service: { id: serviceId },
            paths: [path]
        });
        console.log(`Route created for service ${serviceId}:`, response.data);
    } catch (error) {
        console.error(`Error creating route for service ${serviceId}:`, error);
    }
}

module.exports = { createRoute };
