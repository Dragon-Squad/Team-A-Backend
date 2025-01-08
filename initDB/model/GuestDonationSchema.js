const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guestDonationSchema = new Schema({
    guestId: { type: Schema.Types.ObjectId, ref: "GuestDonor", index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "PaymentTransaction", required: true, index: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const createGuestDonationModel = (dbConnection) => dbConnection.model('GuestDonation', guestDonationSchema);

module.exports = createGuestDonationModel;