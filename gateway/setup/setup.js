const { createService, createRoute, enableRateLimitingPlugin } = require("./https");

async function setupServicesAndRoutes() {
    try {
        // Define services and their URLs
        const services = {
            EmailService: 'http://172.30.208.1:3001',
            CharityManagementService: 'http://172.30.208.1:3002',
            ProjectManagementService: 'http://172.30.208.1:3003',
            FileUploadService: 'http://172.30.208.1:3004'
        };

        // Step 1: Create services and collect their IDs
        const serviceIds = {};
        for (const [serviceName, serviceUrl] of Object.entries(services)) {
            try {
                serviceIds[serviceName] = await createService(serviceName, serviceUrl);
                console.log(`${serviceName} created with ID: ${serviceIds[serviceName]}`);
            } catch (serviceError) {
                console.error(`Error creating service ${serviceName}:`, serviceError.message);
            }
        }

        // Step 2: Enable Rate Limiting for all the services
        await enableRateLimitingPlugin(services);

        // Step 3: Create routes for each service
        // Email Service Routes
        const emailRoutes = [
            '/email/new/verify',
            '/email/new/welcome',
            '/email/donor/donation-success',
            '/email/donor/project-created',
            '/email/donor/project-halted',
            '/email/charity/project-created',
            '/email/charity/project-halted',
            '/email/charity/project-completed'
        ];
        for (const route of emailRoutes) {
            try {
                await createRoute(serviceIds.EmailService, route);
                console.log(`Route created for EmailService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for EmailService:`, routeError.message);
            }
        }

        // Project Management Service Routes
        const projectRoutes = [
            '/project/active'
        ];
        for (const route of projectRoutes) {
            try {
                await createRoute(serviceIds.ProjectManagementService, route);
                console.log(`Route created for ProjectManagementService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for ProjectManagementService:`, routeError.message);
            }
        }

        // File Upload Service Routes
        const fileRoutes = ['/files/upload/', '/files'];
        for (const route of fileRoutes) {
            try {
                await createRoute(serviceIds.FileUploadService, route);
                console.log(`Route created for FileUploadService: ${route}`);
            } catch (routeError) {
                console.error(`Error creating route ${route} for FileUploadService:`, routeError.message);
            }
        }

        console.log("Services and Routes setup completed successfully.");
    } catch (error) {
        console.error("Error during setup:", error.message);
    }
}


setupServicesAndRoutes();
