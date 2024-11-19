const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const charitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String , required: true},
  type: { type: String, enum: ['individual', 'corporate', 'non-profit'], required: true },
  description: { type: String },
  address: { type: String , required: true},
  taxCode: { type: String , required: true},
  images: { type: [String] },
  videos: { type: [String] },
  stripeId: { type: String }
});

module.exports = mongoose.model('Charity', charitySchema);
