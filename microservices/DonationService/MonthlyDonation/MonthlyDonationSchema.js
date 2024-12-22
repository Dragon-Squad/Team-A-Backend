const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monthlyDonationSchema = new Schema({
  // donorId: { type: Schema.Types.ObjectId, ref: 'Donor' },
  donorId: { type: String},
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  stripeSubscriptionId: { type: String},
  amount: { type: Number },
  isActive: { type: Boolean },
  startedDate: { type: Date, default: Date.now },
  renewDate: { type: Date  },
  cancelledAt: { type: Date },
});

module.exports = mongoose.model('MonthlyDonation', monthlyDonationSchema);
