const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, }
});

const regionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  subscriptionList: [{ type: Schema.Types.ObjectId, ref: 'Donor' }],
  notificationList: [{ type: notificationSchema, default: () => ({}) }]
});

const createRegionModel = (dbConnection) => dbConnection.model('Region', regionSchema);

module.exports = createRegionModel;