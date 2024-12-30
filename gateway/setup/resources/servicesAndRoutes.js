const authRoutes = [
    'auth/new',
    'auth/login',
    'auth/logout'
];

const cryptRoutes = [
    '/crypt/asym/public',
    '/crypt/asym/decrypt',
    '/crypt/jwe/public',
    '/crypt/jwe/certificate',
    '/crypt/jwe/decrypt',
]

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
    '/projects/all',
    '/projects/',
    '/projects/halted/',
    '/projects/resume/',
    '/category/',
    '/category/subscribe/',
    '/category/unsubscribe/',
    '/category/notification-on/',
    '/category/notification-off/',
    '/region/',
    '/region/subscribe/',
    '/region/unsubscribe/',
    '/region/notification-on/',
    '/region/notification-off/'
];

const fileRoutes = ['/files/upload/', '/files'];

const donationRoutes = [
    '/donation/',
    '/donation/all',
    '/donation/new',
    '/donation/donor/',
    '/donation/project/',
    '/donation/monthly/',
    '/donation/monthly/new',
    '/donation/monthly/donor/',
    '/donation/monthly/cancel/',
    '/donation/webhook/handle',
];

const charityRoutes = [
    '/charity/payment-method/'
];

const deleteShardRoutes = [
    'deleted/projects/all',
    'deleted/projects/',
];

const services = [
    'AuthService',
    'CryptService',
    'EmailService',
    'CharityManagementService',
    'ProjectManagementService',
    'FileUploadService',
    'DonationService',
    'DeleteShardService'
];

module.exports = {
    authRoutes,
    cryptRoutes,
    emailRoutes,
    projectRoutes,
    fileRoutes,
    donationRoutes,
    charityRoutes,
    deleteShardRoutes,
    services
};
