export interface User {
    id: string;
    email: string;
    userName?: string;
    password: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
    watchlist: number[];
    favorites: number[];
    history: Record<string, number>;
    lastActive: Date;
    continueWatching: {animeId: number; episode: number}[];
    preferences: {
        theme: 'light' | 'dark' | 'system';
    };
}

export interface Anime {
    id: number;
    anilistId: number;
    title: string;
    description?: string;
    coverImage: string;
    bannerImage: string;
    episodes: number;
    status: string;
    season: string;
    seasonYear: number;
    genres: string[];
    averageScore: number;
    popularity: number;
    format: string;
    createdAt: Date;
    updatedAt: Date;
    popularityRank: number;
    averageScoreRank: number;
    seasonInt: number;
}

export interface SearchResult {
    id: number;
    title: string;
    coverImage: string;
    format: string;
    status: string;
    episodes: number;
    averageScore: number;
}

export interface AnilistAnimeResponse {
    data: {
        Media: {
            id: number;
            title: {
                romaji: string; english: string; native: string;
            };
            description?: string;
            coverImage: {
                large: string;
            };  
            bannerImage: string;
            episodes: number;
            status: string;
            season: string;
            seasonYear: number; 
            genres: string[];
            averageScore: number;
            popularity: number;
            format: string;
        };
    };
}

export interface AnilistSearchResponse {
    data: {
        Page: { 
            media: Array<{
                id: number;
                title: {
                    romaji: string; english: string; native: string;
                };
                coverImage: {
                    large: string;
                };
                format: string;
                status: string; 
                episodes: number;
                averageScore: number;
            }>;
        };
    };
}

export type AnilistCacheData = Anime | SearchResult | Record<string, unknown>;

export interface jwtPayload {
    userId: string;
    email: string;
    userName: string | undefined;
    iat: number;
    exp: number;
}

