export type UserRole = 'admin' | 'employee' | 'user';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    role?: UserRole;
}
