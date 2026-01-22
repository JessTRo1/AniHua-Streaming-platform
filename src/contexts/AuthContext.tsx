'use server'

import { createContext, ReactNode, useContext, useState } from 'react'
import { register } from '@/actions/auth'
import { login } from '@/actions/auth'

interface Props {
    children?: ReactNode;
    data?: any;
    register?: typeof register;
    login?: typeof login;
}

const AuthContext = createContext(null);

export default function AuthProvider({ children, data, register, login }: Props) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth-token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

    const login = async (emailOrUsername: string, password: string) => {
        const data = await login({ emailOrUsername, password });
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user', JSON.stringify({ userId: data.userId, email: data.email }));
        setIsAuthenticated(true);
        setUser({ userId: data.userId, email: data.email });
        return data;
    }

    return (
    <AuthContext.Provider value={{ isAuthenticated, user, login }}>
        {children}
    </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

