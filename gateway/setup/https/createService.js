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

module.exports = { createService };
