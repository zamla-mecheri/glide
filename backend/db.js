const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/autoconnect';

async function connect() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Using in-memory fallback - set MONGODB_URI for cloud DB (e.g. MongoDB Atlas)');
  }
}

module.exports = { connect };
