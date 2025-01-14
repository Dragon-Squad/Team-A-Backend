const {
    connectAuthDB,
    connectCharityDB,
    connectDonationDB,
    connectDonorDB,
    connectProjectDB,
    connectShardedProjectDB,
} = require("./Config/DBConfig");
const {
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
    createGuestDonorModel,
    createGuestDonationModel,
    createPaymentTransactionModel,
    createDeletedProjectModel,
    createCompletedProjectModel,
} = require("./model");
const {
    createAdminAccount,
} = require("./initData/schemaData/AdminCreation/createAdminAccount");
const {
    createCharities,
} = require("./initData/schemaData/CharityCreation/createCharities");
const {
    createDonors,
} = require("./initData/schemaData/DonorCreation/createDonors");
const {
    createCategories,
    createRegions,
    createProjects,
} = require("./initData/schemaData/ProjectCreation");

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
        const GuestDonor = createGuestDonorModel(donationDB);
        const GuestDonation = createGuestDonationModel(donationDB);
        const PaymentTransaction = createPaymentTransactionModel(donationDB);

        const shardedProjectDB = await connectShardedProjectDB();
        const DeletedProject = createDeletedProjectModel(shardedProjectDB);
        const CompletedProject = createCompletedProjectModel(shardedProjectDB);

        console.log("Clearing existing data...");
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
        await GuestDonor.deleteMany();
        await GuestDonation.deleteMany();
        await PaymentTransaction.deleteMany();
        await DeletedProject.deleteMany();
        await CompletedProject.deleteMany();

        // Perform operations
        await createAdminAccount(Admin);
        const charityDocs = await createCharities(User, Charity, Address);
        await createDonors(User, Donor, Address);
        const categoryDocs = await createCategories(Category);
        const regionDocs = await createRegions(Region);
        await createProjects(Project, charityDocs, categoryDocs, regionDocs);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit(0);
    }
})();
