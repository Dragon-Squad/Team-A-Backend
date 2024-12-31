const createAddressModel = require('./AddressSchema');
const createAdminModel = require('./AdminSchema');
const createUserModel = require('./UserSchema');
const createCharityModel = require('./CharitySchema');
const createDonorModel = require('./DonorSchema');
const createCategoryModel = require('./CategorySchema');
const createRegionModel = require('./RegionSchema');
const createProjectModel = require('./ProjectSchema');
const createDonationModel = require('./DonationSchema');
const createMonthlyDonationModel = require('./MonthlyDonationSchema');
const createPaymentTransactionModel = require('./PaymentTransactionSchema');
const createDeletedProjectModel = require('./DeletedProjectSchema');
const createCompletedProjectModel = require('./CompletedProjectSchema');

module.exports = {
    createAddressModel,
    createAdminModel,
    createUserModel,
    createCharityModel,
    createDonorModel,
    createCategoryModel,
    createRegionModel,
    createProjectModel,
    createDonationModel,
    createMonthlyDonationModel,
    createPaymentTransactionModel,
    createDeletedProjectModel,
    createCompletedProjectModel,
}