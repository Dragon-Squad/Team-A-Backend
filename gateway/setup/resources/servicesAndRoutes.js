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
    '/category/all',
    '/category/subscribe/',
    '/category/unsubscribe/',
    '/category/notification-on/',
    '/category/notification-off/',
    '/region/',
    '/region/all',
    '/region/subscribe/',
    '/region/unsubscribe/',
    '/region/notification-on/',
    '/region/notification-off/'
];

const fileRoutes = ['/files/upload/', '/files'];

const donationRoutes = [
    '/donation/guest/',
    '/donation/guest/all',
    '/donation/guest/new',
    '/donation/guest/project/',
    '/donation/',
    '/donation/all',
    '/donation/new',
    '/donation/donor/',
    '/donation/project/',
    '/donation/monthly/',
    '/donation/monthly/all',
    '/donation/monthly/new',
    '/donation/monthly/donor/',
    '/donation/monthly/cancel/',
    '/donation/webhook/handle'
];

const shardedProjectRoutes = [
    '/deleted/projects/all',
    '/deleted/projects/',
];

const services = [
    'CryptService',
    'EmailService',
    'ProjectManagementService',
    'DonationService',
    'ShardedProjectService'
];

module.exports = {
    cryptRoutes,
    emailRoutes,
    projectRoutes,
    fileRoutes,
    donationRoutes,
    shardedProjectRoutes,
    services
};
