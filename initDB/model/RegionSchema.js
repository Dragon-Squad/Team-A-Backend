const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const regionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  subscriptionList: [{ type: Schema.Types.ObjectId, ref: 'Donor' }],
  notificationList: [{ type: Schema.Types.ObjectId, ref: 'Donor' }]
});

const createRegionModel = (dbConnection) => dbConnection.model('Region', regionSchema);

module.exports = createRegionModel;