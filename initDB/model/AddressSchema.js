const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    continent: { type: String },
});

const createAddressModel = (dbConnection) =>
    dbConnection.model("Address", addressSchema);

module.exports = createAddressModel;
