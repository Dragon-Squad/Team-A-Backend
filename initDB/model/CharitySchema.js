const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const charitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String , required: true},
  address: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
  region: [{ type: String} ],
  category: [{ type: String} ],
  type: { type: String, enum: ['Person', 'Company', 'Non-profit Organization'], required: true },
  description: { type: String },
  taxCode: { type: String , required: true},
});

const createCharityModel = (dbConnection) => dbConnection.model('Charity', charitySchema);

module.exports = createCharityModel;
