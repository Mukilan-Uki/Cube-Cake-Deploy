const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('MongoDB Connected Successfully!');
    console.log(`Database: ${MONGODB_URI}`);
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('Make sure MongoDB is installed and running');
    return false;
  }
};

module.exports = connectDB;