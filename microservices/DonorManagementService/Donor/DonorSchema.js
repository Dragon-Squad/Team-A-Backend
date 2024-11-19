const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String , required: true},
  lastName: { type: String , required: true},
  gender: { type: String, enum: ['male', 'female', 'other']}, 
  address: { type: String },
  avatar: { type: String },
  totalDonation: { type: Number, default: 0},
  stripeId: { type: String }
});

module.exports = mongoose.model('Donor', donorSchema);
