const { createRoute } = require("./createRoute");
const { createService } = require("./createService");
const { enableRateLimitingPlugin } = require("./enableRateLimit");

module.exports = {
    createRoute,
    createService,
    enableRateLimitingPlugin
};