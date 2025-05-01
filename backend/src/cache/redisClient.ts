import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('❌ Redis error:', err));

redisClient.connect(); // Important for redis v4

export default redisClient;
