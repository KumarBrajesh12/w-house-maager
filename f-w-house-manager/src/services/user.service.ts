import api from '@/lib/axios';
import { User } from '@/types/auth';

export const userService = {
    async getUsers(): Promise<User[]> {
        return api.get('/users') as any;
    },

    async getUserById(id: string): Promise<User> {
        return api.get(`/users/${id}`) as any;
    },

    async updateUser(id: string, data: Partial<User>): Promise<User> {
        return api.patch(`/users/${id}`, data) as any;
    },

    async deleteUser(id: string): Promise<any> {
        return api.delete(`/users/${id}`) as any;
    },
};
