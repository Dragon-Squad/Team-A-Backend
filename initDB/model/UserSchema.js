const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Donor', 'Charity'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  avatar: { type: String },
  introVideo: { type: String },
  address: { type: Schema.Types.ObjectId, ref: 'Address' }
});

const createUserModel = (dbConnection) => dbConnection.model('User', userSchema);

module.exports = createUserModel;
