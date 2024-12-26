const { waitForKongAdminAPI, createService, createRoute, enableRateLimitingPlugin } = require("./https");
const { authRoutes, cryptRoutes, emailRoutes, projectRoutes, fileRoutes, donationRoutes, charityRoutes, deleteShardRoutes, services } = require("./resources/servicesAndRoutes");
const IPAdr = process.env.IP_ADR || "host.docker.internal";

// Main function to create services and their corresponding routes
async function setupServices() {
    try {
        await waitForKongAdminAPI();

        // Step 1: Create services
        const authServiceId = await createService('AuthService', `http://${IPAdr}:3000`);
        const emailServiceId = await createService('EmailService', `http://${IPAdr}:3001`);
        const charityManagementServiceId = await createService('CharityManagementService', `http://${IPAdr}:3002`);
        const projectManagementServiceId = await createService('ProjectManagementService', `http://${IPAdr}:3003`);
        const fileUploadServiceId = await createService('FileUploadService', `http://${IPAdr}:3004`);
        const donationServiceId = await createService('DonationService', `http://${IPAdr}:3005`);
        const deleteShardServiceId = await createService('DeleteShardService', `http://${IPAdr}:3006`);
        const cryptServiceId = await createService('CryptService', `http://${IPAdr}:3008`);

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
        for (const route of deleteShardRoutes) {
            try {
                await createRoute(deleteShardServiceId, route);
                console.log(`Route created for DeleteShardService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for DeleteShardService:`, routeError.message);
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