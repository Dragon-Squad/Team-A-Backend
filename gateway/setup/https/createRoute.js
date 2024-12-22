const axios = require('axios');

function transformPath(input) {
    // Check if the input starts with a "/" and remove it
    if (input.startsWith('/')) {
        input = input.substring(1);
    }
    // Replace all remaining "/" with "_"
    return input.replace(/\//g, '_');
}

// Function to create a route for a service
async function createRoute(serviceId, path) {
    try {
        const response = await axios.post('http://kong-gateway:8001/routes/', {
            name: transformPath(path), 
            service: { id: serviceId },
            paths: [path],
            path_handling: 'v1',
            strip_path: false
        });
        console.log(`Route created for service ${serviceId}:`, response.data);
    } catch (error) {
        console.error(`Error creating route for service ${serviceId}:`, error);
    }
}

module.exports = { createRoute };
