const { waitForKongAdminAPI, createService, createRoute, enableRateLimitingPlugin, serversDiscovery } = require("./https");
const { authRoutes, cryptRoutes, emailRoutes, projectRoutes, fileRoutes, donationRoutes, charityRoutes, shardedProjectRoutes, services } = require("./resources/servicesAndRoutes");
const IPAdr = process.env.IP_ADR || "172.30.208.1";

const serviceMap = new Map([
    ['email', 'EmailService'],
    ['auth', 'AuthService'],
    ['project', 'ProjectManagementService'],
    ['donation', 'DonationService'],
    ['shard', 'ShardedProjectService'],
    ['crypt', 'CryptService'],
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
        const authServiceId = await createService(serviceMap.get('auth'), urlMap.get('auth'));
        const projectManagementServiceId = await createService(serviceMap.get('project'), urlMap.get('project'));
        const donationServiceId = await createService(serviceMap.get('donation'), urlMap.get('donation'));
        const shardedProjectServiceId = await createService(serviceMap.get('shard'), urlMap.get('shard'));
        const cryptServiceId = await createService(serviceMap.get('crypt'), urlMap.get('crypt'));

        const charityManagementServiceId = await createService('CharityManagementService', `http://${IPAdr}:3002`);

        // Step 2: Create routes for the created services
        // Routes for Auth Service
        for (const route of authRoutes) {
            try {
                await createRoute(authServiceId, route);
                console.log(`Route created for AuthService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for AuthService:`, routeError.message);
            }
        }

        // Routes for Crypt Service
        for (const route of cryptRoutes) {
            try {
                await createRoute(cryptServiceId, route);
                console.log(`Route created for CryptService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for CryptService:`, routeError.message);
            }
        }

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
        
        // Routes for File Upload Service
        for (const route of fileRoutes) {
            try {
                await createRoute(fileUploadServiceId, route);
                console.log(`Route created for FileUploadService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for FileUploadService:`, routeError.message);
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

        // Routes for Charity Service
        for (const route of charityRoutes) {
            try {
                await createRoute(charityManagementServiceId, route);
                console.log(`Route created for CharityManagementService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for CharityManagementService:`, routeError.message);
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