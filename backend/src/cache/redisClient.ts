import { createClient } from 'redis';
import { config } from '../config';

const redisClient = createClient({
  url: config.redis,
  socket: {
    host: new URL(config.redis).hostname,
    port: parseInt(new URL(config.redis).port),
    ...(config.isProduction && {
      tls: true,
      rejectUnauthorized: false
    })
  }
});

// Connection function remains the same
export async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected!');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
    throw err;
  }
}

// Named export instead of default
export { redisClient };