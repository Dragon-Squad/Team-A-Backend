const { waitForKongAdminAPI, createService, createRoute, enableRateLimitingPlugin, serversDiscovery } = require("./https");
const { emailRoutes, projectRoutes, donationRoutes, shardedProjectRoutes, services } = require("./resources/servicesAndRoutes");
const IPAdr = process.env.IP_ADR || "172.30.208.1";

const serviceMap = new Map([
    ['email', 'EmailService'],
    ['project', 'ProjectManagementService'],
    ['donation', 'DonationService'],
    ['shard', 'ShardedProjectService'],
  ]);

// Main function to create services and their corresponding routes
async function setupServices() {
    try {
        await waitForKongAdminAPI();

        const urlMap = await serversDiscovery(serviceMap);

        for (const [key, url] of urlMap) {
            console.log(`${key}  :  ${url}`);
        }

        // Step 1: Create services
        const emailServiceId = await createService(serviceMap.get('email'), urlMap.get('email'));
        const projectManagementServiceId = await createService(serviceMap.get('project'), urlMap.get('project'));
        const donationServiceId = await createService(serviceMap.get('donation'), urlMap.get('donation'));
        const shardedProjectServiceId = await createService(serviceMap.get('shard'), urlMap.get('shard'));

        // Step 2: Create routes for the created services
        // Routes for Email Service
        for (const route of emailRoutes) {
            try {
                await createRoute(emailServiceId, route);
                console.log(`Route created for EmailService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for EmailService:`, routeError.message);
            }
        }

        // Routes for Project Management Service
        for (const route of projectRoutes) {
            try {
                await createRoute(projectManagementServiceId, route);
                console.log(`Route created for ProjectManagementService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for ProjectManagementService:`, routeError.message);
            }
        }

        // Routes for Donation Service
        for (const route of donationRoutes) {
            try {
                await createRoute(donationServiceId, route);
                console.log(`Route created for DonationService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for DonationService:`, routeError.message);
            }
        }

        // Routes for Delete Shard Service
        for (const route of shardedProjectRoutes) {
            try {
                await createRoute(shardedProjectServiceId, route);
                console.log(`Route created for shardedProjectService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for shardedProjectService:`, routeError.message);
            }
        }

        //Step 3: Enable Rate Limiting
        await enableRateLimitingPlugin(services);

        console.log("Services and Routes setup completed.");
    } catch (error) {
        console.error("Error during setup:", error);
    }
}
setupServices();