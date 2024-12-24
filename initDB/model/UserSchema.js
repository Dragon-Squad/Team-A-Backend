const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  isActive: { type: Boolean },
  avatar: { type: String },
  introVideo: { type: String },
  opt: { type: String },
  otpExpiry: { type: Date },
  refreshToken: { String }
});

const createUserModel = (dbConnection) => dbConnection.model('User', userSchema);

module.exports = createUserModel;
