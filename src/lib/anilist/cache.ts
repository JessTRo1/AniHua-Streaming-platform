import { LRUCache } from 'lru-cache';

// Create a cache instance for Anilist data

export const anilistCache = new LRUCache<string, unknown>({

    max: 500, // Maximum number of items in cache

    ttl: 1000 * 60 * 60, // 1 hour TTL
});

