const { connectAuthDB, connectCharityDB, connectDonorDB, connectDonationDB, connectProjectDB } = require('./Config/DBConfig');
const createUserModel = require('./model/UserSchema');
const createCharityModel = require('./model/CharitySchema');
const createDonorModel = require('./model/DonorSchema');
const createCategoryModel = require('./model/CategorySchema');
const createRegionModel = require('./model/RegionSchema');
const createProjectModel = require('./model/ProjectSchema');
const { createAdminAccount } = require('./initData/schemaData/AuthService/createAdminAccount');
const { createCharities } = require('./initData/schemaData/CharityManagementService/createCharities');
const { createDonors } = require('./initData/schemaData/DonorManagementService/createDonors');
const { createCategories } = require('./initData/schemaData/ProjectManagementService/createCategories');
const { createRegions } = require('./initData/schemaData/ProjectManagementService/createRegions');
const { createProjects } = require('./initData/schemaData/ProjectManagementService/createProjects');

(async () => {
  try {
    const authDB = await connectAuthDB();
    const User = createUserModel(authDB);

    const charityDB = await connectCharityDB();
    const Charity = createCharityModel(charityDB);

    const donorDB = await connectDonorDB();
    const Donor = createDonorModel(donorDB);

    const projectDB = await connectProjectDB();
    const Category = createCategoryModel(projectDB);
    const Region = createRegionModel(projectDB);
    const Project = createProjectModel(projectDB);

    // Perform operations
    await createAdminAccount(User);
    const charityDocs = await createCharities(User, Charity);
    await createDonors(User, Donor);
    const categoryDocs = await createCategories(Category);
    const regionDocs = await createRegions(Region);
    await createProjects(Project, charityDocs, categoryDocs, regionDocs);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0); 
  }
})();
