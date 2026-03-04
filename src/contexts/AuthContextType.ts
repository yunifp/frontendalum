import React from 'react';

export interface User {
    id: number;
    nim: string;
    email: string;
    username: string;
    hp: string | null;
    role: string;
    status: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}