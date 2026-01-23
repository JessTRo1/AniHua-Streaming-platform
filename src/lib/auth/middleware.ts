'use server'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { jwtPayload } from '@/types/user';

/**
 * Middleware to protect routes by verifying JWT authentication token.
 * Extracts token from cookies, validates it, and returns user information.
 * 
 * @returns Object containing userId and email from the JWT payload
 * @throws {Error} 401 - Authentication token missing, invalid, or expired
 * @throws {Error} 500 - JWT_SECRET environment variable not set
 * 
 * @example
 * const user = await authMiddleware();
 * console.log(user.userId); // 
 */
export async function authMiddleware() {
    // Extract token from cookies
    const cookieStore = await cookies() 
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        const error = new Error('Authentication token is missing');
        (error as Error & { status?: number }).status = 401;
        throw error;
    }
    else if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable not set');
    }

    try {
        // Decode and verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            const error = new Error('Invalid authentication token');
            (error as Error & { status?: number }).status = 401;
            throw error;
        }

        return {
            userId: (decoded as jwtPayload).userId,
            email: (decoded as jwtPayload).email,
            userName: (decoded as jwtPayload).userName,

        };

    }
    catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            const error = new Error('Invalid authentication token');
            (error as Error & { status?: number }).status = 401;
            throw error;
        }
        else if (err instanceof jwt.TokenExpiredError) {
            const error = new Error('Token expired');
            (error as Error & { status?: number }).status = 401;
            throw error;
        }
        throw err;
    }

}