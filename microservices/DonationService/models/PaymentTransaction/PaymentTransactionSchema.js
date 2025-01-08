const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentTransactionSchema = new Schema({
  amount: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  paymentProvider: { type: String, required: true },
});

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
