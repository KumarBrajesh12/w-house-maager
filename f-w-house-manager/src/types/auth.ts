export type UserRole = 'admin' | 'employee' | 'user';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    tenantId?: string;
    tenantName?: string;
    subscriptionStatus?: string;
    planId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
        tenantId?: string;
        tenantName?: string;
        subscriptionStatus?: string;
        planId?: string;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    role?: UserRole;
    tenantName?: string;
}
