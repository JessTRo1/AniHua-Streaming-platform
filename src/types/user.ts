// Public user profile 
export interface User {
    id: string;
    email: string;
    userName: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
    lastActive?: Date;
}

// Extended user with preferences (for authenticated user only)
export interface UserProfile extends User {
    preferences?: {
        theme: 'light' | 'dark' | 'system';
    };
}

// JWT payload
export interface jwtPayload {
    userId: string;
    email: string;
    userName: string;
    iat: number;
    exp: number;
}
