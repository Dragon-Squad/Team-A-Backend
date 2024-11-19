require('dotenv').config();
const mongoose = require('mongoose');

// Connect to the DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_DONOR);
    console.log('MongoDB connected');

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };