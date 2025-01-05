const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guestDonorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String},
});

module.exports = mongoose.model("GuestDonor", guestDonorSchema);