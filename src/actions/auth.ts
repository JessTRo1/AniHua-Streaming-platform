'use server';

import bcrypt, { hash } from 'bcryptjs';
import { prisma } from '@/lib/anilist/prisma';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

// Zod schema for registration data validation
const registerSchema = z.object({
    email: z.string().regex(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/, { message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' })
        .regex(/[\W_]/, { message: 'Password must contain at least one special character' }),
    userName: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
});

// Response type for authentication actions
type AuthResponse =
    | { success: true; userId: string; token: string }
    | { error: string; details?: z.ZodError['issues'] };

// Registration function 
export async function register(formData: FormData): Promise<AuthResponse> {
    try {
        const data = {
            email: (formData.get('email') as string).trim().toLowerCase(),
            password: formData.get('password') as string,
            userName: (formData.get('userName') as string).trim(),
        }

        // Zod validation
        const validated = registerSchema.parse(data);

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: {
                email: validated.email,
            },
        });
        if (userExists) {
            return { error: 'Email already exists' };
        }

        // Check if JWT_SECRET defined
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable not set');
        }

        // Hash password
        const hashedPassword = await hash(validated.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validated.email,
                password: hashedPassword,
                username: validated.userName,
            },
        });

        // Create JWT token
        const token = sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '7d',
            }
        );

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return { success: true, userId: user.id, token };
    } catch (error) {

        if (error instanceof z.ZodError) {
            return { error: 'Invalid input data', details: error.issues };
        }
        return { error: (error as Error).message };
    }
}

// Login function

const loginSchema = z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string().min(8),
}).refine((data) => data.username || data.email, { message: 'Either username or email is required' });

export async function login(formData: FormData): Promise<AuthResponse> {
    try {
        const { username, email, password } = Object.fromEntries(formData.entries()) as {
            username?: string;
            email?: string;
            password: string;
        };

        // Zod validation
        const validated = loginSchema.parse({ username, email, password });

        // Find user by email or username
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                     validated.email ? { email: validated.email } : undefined,
                     validated.username ? { username: validated.username } : undefined 
                ].filter(Boolean) as object[],
            }
        });

        // User not found
        if (!user) {
            return { error: 'Invalid username/email or password' };
        }

        // Check password
        const isMatch = await bcrypt.compare(validated.password, user.password);
        if (!isMatch) {
            return { error: 'Invalid username/email or password' };
        }

        // Check if JWT_SECRET defined
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable not set');
        }

        // Create JWT token
        const token = sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '7d',
            }
        );

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return { success: true, userId: user.id, token };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: 'Invalid input data', details: error.issues };
        }
        return { error: (error as Error).message };
    }
}

// Logout function
export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    return { success: true };
}


