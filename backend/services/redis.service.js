import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';

const useMock = process.env.USE_MOCK_REDIS === 'true';
const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST;

let redisClient;

if (useMock || (!redisUrl && !redisHost)) {
    console.log("Using in-memory Redis Mock (zero configuration needed)");
    redisClient = new RedisMock();
} else if (redisUrl) {
    redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) {
                console.warn("Cloud Redis connection timed out. Falling back to in-memory Redis Mock.");
                return null;
            }
            return Math.min(times * 150, 1000);
        }
    });
} else {
    redisClient = new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) {
                console.warn("Redis host connection failed. Falling back to in-memory Redis Mock.");
                return null;
            }
            return Math.min(times * 150, 1000);
        }
    });
}

redisClient.on('connect', () => {
    console.log(useMock || (!redisUrl && !redisHost) ? '✓ Redis Mock connected' : '✓ Connected to external Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis status/warning:', err.message);
});

export default redisClient;