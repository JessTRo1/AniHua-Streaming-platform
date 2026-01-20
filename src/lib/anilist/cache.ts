import { LRUCache } from 'lru-cache';
import type { AnilistCacheData, Anime } from './types.js';

// Cache instance for Anilist data

export const anilistCache = new LRUCache<string, AnilistCacheData>({

    max: 500, 
    ttl: 1000 * 60 * 60, // 1 hour TTL
    updateAgeOnGet: true, // Refresh TTL on access
    updateAgeOnHas: false,
});

export  function cacheAnime(key: string, anime: Anime) {
    anilistCache.set(key, anime);
}

export function getAnimeFromCache(key: string): Anime | undefined {
    return anilistCache.get(key) as Anime | undefined;
}