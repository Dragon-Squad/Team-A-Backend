const { createService, createRoute, enableRateLimitingPlugin } = require("./https");

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

const projectRoutes = [
    '/project/active'
];

const fileRoutes = ['/files/upload/', '/files'];

const donationRoutes = ['/donation/new', '/donation/test'];

const services = [
    'EmailService',
    'CharityManagementService',
    'ProjectManagementService',
    'FileUploadService',
    'DonationService'
];

// Main function to create services and their corresponding routes
async function setupServices() {
    try {
        // Step 1: Create services
        const emailServiceId = await createService('EmailService', 'http://172.30.208.1:3001');
        // const charityManagementServiceId = await createService('EmailService', 'http://172.30.208.1:3002');
        const projectManagementServiceId = await createService('ProjectManagementService', 'http://172.30.208.1:3003');
        const fileUploadServiceId = await createService('FileUploadService', 'http://172.30.208.1:3004');
        const donationServiceId = await createService('DonationService', 'http://172.30.208.1:3005');

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

        //Step 3: Enable Rate Limiting
        await enableRateLimitingPlugin(services);

        console.log("Services and Routes setup completed.");
    } catch (error) {
        console.error("Error during setup:", error);
    }
}
setupServices();