const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'Donor' },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  donationType: { type: String, enum: ['one-time', 'monthly'], required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const createDonationModel = (dbConnection) => dbConnection.model('Donation', donationSchema);

module.exports = createDonationModel;
