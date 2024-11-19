const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  subscriptionList: [{ type: Schema.Types.ObjectId, ref: 'Donor' }],
  notificationList: [{ type: Schema.Types.ObjectId, ref: 'Donor' }]
});

const createCategoryModel = (dbConnection) => dbConnection.model('Category', categorySchema);

module.exports = createCategoryModel;
