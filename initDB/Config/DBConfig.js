require('dotenv').config();
const mongoose = require('mongoose');

let AddressDB, AdminDB, AuthDB, CharityDB, DonorDB, DonationDB, ProjectDB, UserDB, ShardedProjectDB;

const connectAddressDB = async () => {
  if (!AddressDB) {
    AddressDB = await mongoose.createConnection(process.env.MONGO_URI_ADDRESS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to AddressDB');
  }
  return AddressDB;
};

const connectAdminDB = async () => {
  if (!AdminDB) {
    AdminDB = await mongoose.createConnection(process.env.MONGO_URI_ADMIN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to AdminDB');
  }
  return AdminDB;
};

const connectAuthDB = async () => {
  if (!AuthDB) {
    AuthDB = await mongoose.createConnection(process.env.MONGO_URI_AUTH, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to AuthDB');
  }
  return AuthDB;
};

const connectCharityDB = async () => {
  if (!CharityDB) {
    CharityDB = await mongoose.createConnection(process.env.MONGO_URI_CHARITY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to CharityDB');
  }
  return CharityDB;
};

const connectDonationDB = async () => {
    if (!DonationDB) {
        DonationDB = await mongoose.createConnection(process.env.MONGO_URI_DONATION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to DonationDB');
    }
    return DonationDB;
};

const connectDonorDB = async () => {
    if (!DonorDB) {
        DonorDB = await mongoose.createConnection(process.env.MONGO_URI_DONOR, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to DonorDB');
    }
    return DonorDB;
};

const connectProjectDB = async () => {
    if (!ProjectDB) {
        ProjectDB = await mongoose.createConnection(process.env.MONGO_URI_PROJECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to ProjectDB');
    }
    return ProjectDB;
};

const connectUserDB = async () => {
  if (!UserDB) {
      UserDB = await mongoose.createConnection(process.env.MONGO_URI_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to UserDB');
  }
  return UserDB;
};

const connectShardedProjectDB = async () => {
  if (!ShardedProjectDB) {
    ShardedProjectDB = await mongoose.createConnection(process.env.MONGO_URI_SHARDED_PROJECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to ShardedProjectDB');
  }
  return ShardedProjectDB;
};

module.exports = { connectAddressDB, connectAuthDB, connectAdminDB, connectCharityDB, connectDonationDB, connectDonorDB, connectProjectDB, connectUserDB, connectShardedProjectDB };
