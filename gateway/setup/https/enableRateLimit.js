const axios = require('axios');

async function enableRateLimitingPlugin(services) {
    try {
        // Apply the plugin to each service
        for (const service of services) {
            try {
                await axios.post(`http://kong-gateway:8001/services/${service}/plugins`, {
                    name: 'rate-limiting',
                    config: {
                        minute: 10,
                        policy: 'local'
                    }
                });

                console.log(`Rate limiting enabled for service: ${service}`);
            } catch (serviceError) {
                console.error(`Error enabling rate limiting for ${service}:`, serviceError.message);
            }
        }
    } catch (error) {
        console.error('Error creating or applying rate-limiting plugin:', error.message);
    }
}

module.exports = { enableRateLimitingPlugin };