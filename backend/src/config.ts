// src/config.ts
import dotenv from 'dotenv';
dotenv.config();

// Validate required variables
const requiredVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'MONGO_URI',
  'RABBITMQ_URL',
  'FRONTEND_URL',
  'API_URL'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
}

export const config = {
  db: {
    postgres: process.env.DATABASE_URL!,
    mongo: process.env.MONGO_URI!
  },
  redis: process.env.REDIS_URL!,
  rabbitmq: process.env.RABBITMQ_URL!,
  frontendUrl: process.env.FRONTEND_URL!,
  apiUrl: process.env.API_URL!,
  port: parseInt(process.env.PORT || '3000'),
  isProduction: process.env.NODE_ENV === 'production'
};