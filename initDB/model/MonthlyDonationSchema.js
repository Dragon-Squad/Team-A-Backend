const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monthlyDonationSchema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'Donor' },
  amount: { type: Number, required: true },
  isActive: { type: Boolean, required: true },
  startedDate: { type: Date, required: true },
  renewDate: { type: Date, required: true },
  cancelledAt: { type: Date },
});
const createMonthlyDonationModel = (dbConnection) => dbConnection.model('MonthlyDonation', monthlyDonationSchema);

module.exports = createMonthlyDonationModel;
