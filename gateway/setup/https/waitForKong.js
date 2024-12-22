const axios = require('axios');

// Function to check if the service is up
async function waitForKongAdminAPI() {
  const url = 'http://kong-gateway:8001';
  const timeout = 5000; // 5 seconds

  while (true) {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        console.log('Kong Admin API is ready.');
        break;
      }
    } catch (error) {
    }

    await new Promise(resolve => setTimeout(resolve, timeout));
    console.log('Waiting for Kong Admin API to be ready...');
  }
}

module.exports = { waitForKongAdminAPI };