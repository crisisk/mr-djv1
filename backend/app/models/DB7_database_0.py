// redisCache.ts
import { createClient, RedisClientType } from 'redis';
import { AvailabilityQuery, AvailabilityResponse } from './types';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

class RedisCache {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({ url: REDIS_URL });
        this.client.on('error', (err) => console.error('Redis Client Error', err));
        this.client.connect().catch((err) => console.error('Failed to connect to Redis', err));
    }

    /**
     * Generates a unique cache key based on the availability query parameters.
     * @param query The availability query object.
     * @returns A string representing the cache key.
     */
    private generateCacheKey(query: AvailabilityQuery): string {
        return `availability:${JSON.stringify(query)}`;
    }

    /**
     * Caches the availability response for a given query.
     * @param query The availability query object.
     * @param response The availability response to cache.
     * @param ttl Time-to-live in seconds for the cache entry.
     * @returns A promise that resolves when the cache operation is complete.
     */
    async cacheAvailability(query: AvailabilityQuery, response: AvailabilityResponse, ttl: number = 3600): Promise<void> {
        const key = this.generateCacheKey(query);
        try {
            await this.client.set(key, JSON.stringify(response), { EX: ttl });
        } catch (err) {
            console.error('Failed to cache availability', err);
            throw err;
        }
    }

    /**
     * Retrieves the cached availability response for a given query.
     * @param query The availability query object.
     * @returns A promise that resolves with the cached availability response, or null if not found.
     */
    async getCachedAvailability(query: AvailabilityQuery): Promise<AvailabilityResponse | null> {
        const key = this.generateCacheKey(query);
        try {
            const cachedResponse = await this.client.get(key);
            return cachedResponse ? JSON.parse(cachedResponse) : null;
        } catch (err) {
            console.error('Failed to retrieve cached availability', err);
            throw err;
        }
    }

    /**
     * Clears the cached availability response for a given query.
     * @param query The availability query object.
     * @returns A promise that resolves when the cache entry is cleared.
     */
    async clearCachedAvailability(query: AvailabilityQuery): Promise<void> {
        const key = this.generateCacheKey(query);
        try {
            await this.client.del(key);
        } catch (err) {
            console.error('Failed to clear cached availability', err);
            throw err;
        }
    }
}

export const redisCache = new RedisCache();

// Example usage:
// const query = { djId: '123', date: '2023-10-01' };
// const response = { available: true, slots: ['10:00', '12:00'] };
// await redisCache.cacheAvailability(query, response);
// const cachedResponse = await redisCache.getCachedAvailability(query);
// await redisCache.clearCachedAvailability(query);
