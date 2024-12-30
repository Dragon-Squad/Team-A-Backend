const { waitForKongAdminAPI } = require("./waitForKong");
const { createRoute } = require("./createRoute");
const { createService } = require("./createService");
const { enableRateLimitingPlugin } = require("./enableRateLimit");
const { serversDiscovery } = require("./serversDiscovery");

module.exports = {
    waitForKongAdminAPI,
    createRoute,
    createService,
    enableRateLimitingPlugin,
    serversDiscovery
};