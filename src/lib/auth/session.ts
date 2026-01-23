'use server'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { authMiddleware } from './middleware';
import { prisma } from '../anilist/prisma';

/**
 * Fetches the current authenticated user's session information.
 * Utilizes authMiddleware to verify the JWT token and retrieve user details.
 * @returns An object containing userId, email, and userName of the authenticated user.
 * @throws {Error} 401 - If the user is not authenticated or token is invalid/expired.
 * @throws {Error} 500 - If there is a server error during authentication.
 * @example
 * const session = await getSession();
 * console.log(session.userId); // 
 */

export async function getCurrentUser() {
    // Get user info from auth middleware
    const user = await authMiddleware();
    const req = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        select: {
            id: true,
            email: true,
            userName: true,
        },          
    });
    return req;
}

// Require authentication for protected routes
export async function requireAuth() {
        const user = await authMiddleware();
        return user;
    
}
// Get session information if available, otherwise return null
export async function getSession() {
    try {
        const user = await authMiddleware();
        return user;
    } catch (error) {
        const err = error as Error & { status?: number };
        if (err.status === 401) {
            console.log('User not authenticated:', err.message);
            return null;
        }
    }
    return null;
}

// Refresh the user's session by generating a new JWT token
export async function refreshSession() {
    try {
        const user = await authMiddleware();
        const currentToken = (await cookies()).get('auth-token')?.value;

        if (!currentToken) {
            const error = new Error('Authentication token is missing');
            (error as Error & { status?: number }).status = 401;
            throw error;
        }
        const newToken = jwt.sign(
            {
                userId: user.userId,
                email: user.email,
                userName: user.userName,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );
        (await cookies()).set('auth-token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return { message: 'Session refreshed successfully' };
    } catch (error) {
        throw error;
    }
}