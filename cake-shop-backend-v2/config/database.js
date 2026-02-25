const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cake-shop';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
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