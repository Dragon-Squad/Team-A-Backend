const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentTransactionSchema = new Schema({
  donationId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'donationType',
  },
  type: { type: String, enum: ['Donation', 'GuestDonation'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  paymentProvider: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
