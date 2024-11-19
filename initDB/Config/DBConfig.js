require('dotenv').config();
const mongoose = require('mongoose');

let AuthDB, CharityDB, DonorDB, DonationDB, ProjectDB;

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

module.exports = { connectAuthDB, connectCharityDB, connectDonationDB, connectDonorDB, connectProjectDB };
