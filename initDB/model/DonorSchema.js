const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationStatSchema = new Schema({
    totalDonation: { type: Number, default: 0 },
    monthlyDonated: { type: Number, default: 0 },
    projectsDonated: { type: Number, default: 0 },
});

const donorSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: Schema.Types.ObjectId, ref: "address" },
    region: { type: String },
    hashedStripeId: { type: String, require: true },
    donationStat: { type: donationStatSchema, default: () => ({}) },
});

const createDonorModel = (dbConnection) =>
    dbConnection.model("Donor", donorSchema);

module.exports = createDonorModel;
