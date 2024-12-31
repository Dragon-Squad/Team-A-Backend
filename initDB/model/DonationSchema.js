const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: "Donor", index: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  donationType: { type: String, enum: ["one-time", "monthly"], required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  partitionKey: { type: String, index: true },
});

donationSchema.pre("save", function (next) {
  const date = new Date(this.createdAt);
  this.partitionKey = `${date.getFullYear()}-${date.getMonth() + 1}`; 
});

const createDonationModel = (dbConnection) => dbConnection.model('Donation', donationSchema);

module.exports = createDonationModel;
