const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const createAdminModel = (dbConnection) => dbConnection.model('Admin', adminSchema);

module.exports = createAdminModel;