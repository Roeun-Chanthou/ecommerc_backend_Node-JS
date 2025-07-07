// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;