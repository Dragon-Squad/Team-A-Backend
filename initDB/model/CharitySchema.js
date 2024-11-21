const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const charitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String , required: true},
  type: { type: String, enum: ['individual', 'corporate', 'non-profit'], required: true },
  description: { type: String },
  taxCode: { type: String , required: true}
});

const createCharityModel = (dbConnection) => dbConnection.model('Charity', charitySchema);

module.exports = createCharityModel;
