const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    email: { type: String },
    name: { type: String },
});

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    subscriptionList: [{ type: Schema.Types.ObjectId, ref: "Donor" }],
    notificationList: [{ type: notificationSchema, default: () => [] }],
});

const createCategoryModel = (dbConnection) =>
    dbConnection.model("Category", categorySchema);

module.exports = createCategoryModel;
