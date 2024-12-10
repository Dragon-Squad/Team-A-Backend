const axios = require('axios');

// Function to create a service
async function createService(name, url) {
    try {
        const response = await axios.post('http://kong-gateway:8001/services/', {
            name: name,
            url: url
        });
        console.log(`Service created: ${name}`, response.data);
        return response.data.id; // Return the service ID to use for creating a route
    } catch (error) {
        console.error(`Error creating service ${name}:`, error);
        throw error;
    }
}

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

// Main function to create services and their corresponding routes
async function setupServices() {
    try {
        // Step 1: Create services
        const projectServiceId = await createService('ProjectManagementService', 'http://172.30.208.1:3003');
        const emailServiceId = await createService('EmailService', 'http://172.30.208.1:3001');
        
        // Step 2: Create routes for the created services
        await createRoute(projectServiceId, '/project/active');
        
        console.log("Services and Routes setup completed.");
    } catch (error) {
        console.error("Error during setup:", error);
    }
}

setupServices();
