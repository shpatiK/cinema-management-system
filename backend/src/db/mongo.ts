// src/db/mongo.ts
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/cinema_db';


export const connectMongoDB = async () => {
    try {
      // Add connection event listeners
      mongoose.connection.on('connecting', () => console.log('🔄 Connecting to MongoDB...'));
      mongoose.connection.on('connected', () => console.log('✅ MongoDB connected!'));
      mongoose.connection.on('error', (err) => console.error('❌ MongoDB connection error:', err));
  
      await mongoose.connect(MONGO_URI);
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      process.exit(1);
    }
  };
  
  // Add this to check current connection state
  export const checkMongoConnection = () => {
    return mongoose.connection.readyState === 1; // 1 = connected
  };