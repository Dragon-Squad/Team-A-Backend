const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true,
    },
    transactionId: {
        type: Schema.Types.ObjectId,
        ref: "PaymentTransaction",
        required: true,
        index: true,
    },
    donationType: {
        type: String,
        enum: ["one-time", "monthly"],
        required: true,
    },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
