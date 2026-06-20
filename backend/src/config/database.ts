import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDatabase = async () => {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.MONGODB_URI);
  logger.info('MongoDB connection established');
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
