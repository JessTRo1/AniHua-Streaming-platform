'use server'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { jwtPayload } from '@/types/user';
import { authMiddleware } from './middleware';

/**
 * Fetches the current authenticated user's session information.
 * Utilizes the authMiddleware to verify the JWT token and retrieve user details.
 * @returns An object containing userId, email, and userName of the authenticated user.
 * @throws {Error} 401 - If the user is not authenticated or token is invalid/expired.
 * @throws {Error} 500 - If there is a server error during authentication.
 * @example
 * const session = await getSession();
 * console.log(session.userId); // 
 */
export async function getSession() {}