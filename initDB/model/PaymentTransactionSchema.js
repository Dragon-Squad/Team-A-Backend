const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentTransactionSchema = new Schema({
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        required: true,
    },
    paymentProvider: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const createPaymentTransactionModel = (dbConnection) =>
    dbConnection.model("PaymentTransaction", paymentTransactionSchema);

module.exports = createPaymentTransactionModel;
