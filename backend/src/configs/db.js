import mongoose from 'mongoose';
import { MONGO_DBNAME, MONGO_HOST, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } from './config.js';

const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}?authSource=admin`;

const connectDB = async () => {
  try {
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};
export default connectDB;