const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectDonationSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }, 
  totalDonation: { type: Number, required: true }
});

const donationStatSchema = new Schema({
  totalDonation: { type: Number, default: 0 },
  monthlyDonation: { type: Number, default: 0 },
  projectDonations: [projectDonationSchema] 
});

const donorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  stripeId: { type: String },
  donationStat: { type: donationStatSchema, default: () => ({}) } 
});

const createDonorModel = (dbConnection) => dbConnection.model('Donor', donorSchema);

module.exports = createDonorModel;
