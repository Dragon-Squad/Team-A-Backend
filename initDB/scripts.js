const { connectAuthDB, connectCharityDB, connectDonorDB, connectDonationDB, connectProjectDB } = require('./Config/DBConfig');
const { createAddressModel, createAdminModel, createUserModel, createCharityModel, createDonorModel, createCategoryModel, createRegionModel, createProjectModel, createDonationModel, createMonthlyDonationModel, createPaymentTransactionModel } = require('./model');
const { createAdminAccount } = require('./initData/schemaData/AuthService/createAdminAccount');
const { createCharities } = require('./initData/schemaData/CharityManagementService/createCharities');
const { createDonors } = require('./initData/schemaData/DonorManagementService/createDonors');
const { createCategories, createRegions, createProjects } = require('./initData/schemaData/ProjectManagementService');
const { createBuckets, initImageFiles } = require('./initData/fileData');

(async () => {
  try {
    const authDB = await connectAuthDB();
    const Address = createAddressModel(authDB);
    const User = createUserModel(authDB);
    const Admin = createAdminModel(authDB);

    const charityDB = await connectCharityDB();
    const Charity = createCharityModel(charityDB);

    const donorDB = await connectDonorDB();
    const Donor = createDonorModel(donorDB);

    const projectDB = await connectProjectDB();
    const Category = createCategoryModel(projectDB);
    const Region = createRegionModel(projectDB);
    const Project = createProjectModel(projectDB);

    const donationDB = await connectDonationDB();
    const Donation = createDonationModel(donationDB);
    const MonthlyDonation = createMonthlyDonationModel(donationDB);
    const PaymentTransaction = createPaymentTransactionModel(donationDB);

    console.log('Clearing existing data...');
    await Admin.deleteMany();
    await User.deleteMany();
    await Charity.deleteMany();
    await Address.deleteMany();
    await Donor.deleteMany();
    await Category.deleteMany();
    await Region.deleteMany();
    await Project.deleteMany();
    await Donation.deleteMany();
    await MonthlyDonation.deleteMany();
    await PaymentTransaction.deleteMany();

    console.log('Creating collections for buckets...');
    await createBuckets();  

    console.log("Init Image Files...");
    const fileIds = await initImageFiles();
    console.log(fileIds);

    // Perform operations
    await createAdminAccount(Admin);
    const charityDocs = await createCharities(User, Charity, Address, fileIds);
    await createDonors(User, Donor, Address);
    const categoryDocs = await createCategories(Category);
    const regionDocs = await createRegions(Region);
    await createProjects(Project, charityDocs, categoryDocs, regionDocs);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0); 
  }
})();
