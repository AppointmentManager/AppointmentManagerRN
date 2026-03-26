import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { AuthSession } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextValue {
    session: AuthSession | null;
    signIn: (session: AuthSession) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [session, setSession] = useState<AuthSession | null>(null);

    const value = useMemo<AuthContextValue>(() => ({
        session,
        signIn: (nextSession: AuthSession) => {
            setSession(nextSession);
        },
        signOut: () => {
            AuthService.signOut();
            setSession(null);
        },
    }), [session]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
