import { LRUCache } from 'lru-cache';

// Cache instance for Anilist data

type AnilistCacheData = Anime | SearchResult | Record<string, unknown>;

export const anilistCache = new LRUCache<string, AnilistCacheData>({

    max: 500, // Maximum number of items in cache

    ttl: 1000 * 60 * 60, // 1 hour TTL
});

